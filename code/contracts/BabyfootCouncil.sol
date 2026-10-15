// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

import {YC42} from "./YC42.sol";

/// @title Conseil du Babyfoot
/// @author ycandela
/// @notice Multisig propriétaire de YC42 : chaque action doit être approuvée
///         par 2 de ses 3 membres.
/// @dev Proposer une action compte comme une confirmation. L'action s'exécute
///      automatiquement à la deuxième confirmation.
contract BabyfootCouncil {
    /// @notice Nombre de confirmations nécessaires pour exécuter une proposition.
    uint256 public constant REQUIRED_CONFIRMATIONS = 2;

    /// @notice Une action proposée au Conseil : un mint, ou un transfert de propriété.
    struct Proposal {
        address target; // destinataire du mint, ou nouveau propriétaire de YC42
        uint256 amount; // nombre de tokens à créer (0 pour un transfert de propriété)
        bool isOwnershipTransfer; // vrai : transfert de propriété ; faux : mint
        uint256 confirmations; // nombre de membres qui ont confirmé
        bool executed; // vrai une fois l'action effectuée
    }

    /// @notice Le token géré par le Conseil.
    YC42 public immutable token;

    /// @notice Indique si une adresse fait partie du Conseil.
    mapping(address => bool) public isMember;

    /// @notice Les propositions : le numéro d'une proposition est sa position (0, 1, 2…).
    Proposal[] public proposals;

    /// @notice Indique si un membre a déjà confirmé une proposition.
    mapping(uint256 => mapping(address => bool)) public hasConfirmed;

    error NotCouncilMember(address account);
    error InvalidMember(address member);
    error AlreadyConfirmed(uint256 proposalId, address member);
    error ProposalAlreadyExecuted(uint256 proposalId);

    /// @param yc42 Le token YC42, déjà déployé.
    /// @param councilMembers Les trois membres : des adresses non nulles et toutes différentes.
    constructor(YC42 yc42, address[3] memory councilMembers) {
        token = yc42;
        for (uint256 i = 0; i < councilMembers.length; i++) {
            address member = councilMembers[i];
            require(member != address(0) && !isMember[member], InvalidMember(member));
            isMember[member] = true;
        }
    }

    /// @notice Propose de créer `amount` tokens pour `to`, par exemple pour
    ///         récompenser une correction.
    function proposeMint(address to, uint256 amount) external {
        _propose(Proposal(to, amount, false, 0, false));
    }

    /// @notice Propose de confier la propriété de YC42 à `newOwner`, par exemple
    ///         pour la rendre.
    function proposeOwnershipTransfer(address newOwner) external {
        _propose(Proposal(newOwner, 0, true, 0, false));
    }

    /// @notice Confirme la proposition `proposalId`. La deuxième confirmation l'exécute.
    function confirm(uint256 proposalId) public {
        require(isMember[msg.sender], NotCouncilMember(msg.sender));
        // Si ce numéro n'existe pas, la transaction est annulée automatiquement.
        Proposal storage proposal = proposals[proposalId];
        require(!proposal.executed, ProposalAlreadyExecuted(proposalId));
        require(!hasConfirmed[proposalId][msg.sender], AlreadyConfirmed(proposalId, msg.sender));

        hasConfirmed[proposalId][msg.sender] = true;
        proposal.confirmations += 1;

        if (proposal.confirmations == REQUIRED_CONFIRMATIONS) {
            // Marquée comme exécutée AVANT d'appeler YC42 : elle ne pourra jamais
            // l'être deux fois.
            proposal.executed = true;
            if (proposal.isOwnershipTransfer) {
                token.transferOwnership(proposal.target);
            } else {
                token.mint(proposal.target, proposal.amount);
            }
        }
    }

    /// @dev Enregistre la proposition, puis la confirme au nom de celui qui
    ///      propose. Si ce n'est pas un membre, confirm() échoue et annule toute
    ///      la transaction, enregistrement compris.
    function _propose(Proposal memory proposal) private {
        proposals.push(proposal);
        confirm(proposals.length - 1);
    }
}
