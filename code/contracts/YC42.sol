// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title ycandela-42 (YC42)
/// @author ycandela
/// @notice Token ERC-20 créé pour le projet Tokenizer de 42.
/// @dev Toute la logique standard ERC-20 (soldes, transferts, autorisations)
///      vient de l'implémentation auditée d'OpenZeppelin. Ce contrat n'ajoute
///      que les règles du projet : une supply initiale, un plafond, et un mint
///      réservé au propriétaire.
contract YC42 is ERC20, ERC20Burnable, Ownable {
    /// @notice Nombre maximum de tokens pouvant exister en même temps :
    ///         42 millions, exprimés dans la plus petite unité (18 décimales).
    uint256 public constant MAX_SUPPLY = 42_000_000 * 10 ** 18;

    /// @notice Tokens créés au déploiement et donnés au déployeur :
    ///         4,2 millions, soit 10 % de la supply maximale.
    uint256 public constant INITIAL_SUPPLY = 4_200_000 * 10 ** 18;

    /// @notice Erreur levée quand un mint ferait dépasser MAX_SUPPLY.
    /// @param requestedAmount Quantité que le propriétaire a voulu créer.
    /// @param remainingMintable Quantité qu'il est encore possible de créer.
    error MaxSupplyExceeded(uint256 requestedAmount, uint256 remainingMintable);

    /// @notice Fixe le nom et le ticker, désigne le déployeur comme
    ///         propriétaire et lui donne la supply initiale.
    constructor() ERC20("ycandela-42", "YC42") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    /// @notice Crée "amount" nouveaux tokens et les envoie à "to".
    /// @dev Seul le propriétaire peut l'appeler. Le plafond porte sur les
    ///      tokens en circulation : des tokens brûlés libèrent de la place
    ///      qui peut être mintée à nouveau.
    /// @param to Adresse qui reçoit les nouveaux tokens.
    /// @param amount Nombre de tokens à créer, dans la plus petite unité.
    function mint(address to, uint256 amount) external onlyOwner {
        uint256 remainingMintable = MAX_SUPPLY - totalSupply();
        if (amount > remainingMintable) {
            revert MaxSupplyExceeded(amount, remainingMintable);
        }
        _mint(to, amount);
    }
}
