// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title IrysLinktree
 * @dev Smart contract for decentralized linktree management with Irys integration
 * @notice This contract enables on-chain linktree management with Programmable Data support
 */
contract IrysLinktree is Ownable, ReentrancyGuard {
    using Strings for uint256;

    // Events
    event LinktreeCreated(address indexed owner, string username, string irysTransactionId);
    event LinktreeUpdated(address indexed owner, string username, string irysTransactionId);
    event LinktreeDeleted(address indexed owner, string username);
    event ProfileVerified(address indexed owner, string username);
    event AnalyticsUpdated(address indexed owner, string username, uint256 views, uint256 clicks);
    event PremiumSubscription(address indexed owner, bool isPremium, uint256 expiresAt);

    // Structs
    struct LinktreeProfile {
        string username;
        string displayName;
        string irysTransactionId;
        uint256 createdAt;
        uint256 updatedAt;
        bool isActive;
        bool isVerified;
        bool isPremium;
        uint256 premiumExpiresAt;
        uint256 totalViews;
        uint256 totalClicks;
        string metadata;
    }

    struct Analytics {
        uint256 views;
        uint256 clicks;
        uint256 lastUpdated;
        mapping(string => uint256) linkClicks; // linkId => clicks
    }

    // State variables
    mapping(address => LinktreeProfile) public profiles;
    mapping(string => address) public usernameToAddress;
    mapping(address => Analytics) public analytics;
    
    uint256 public totalProfiles;
    uint256 public totalViews;
    uint256 public totalClicks;
    
    // Premium subscription
    uint256 public premiumPrice = 0.01 ether;
    uint256 public premiumDuration = 30 days;
    
    // Irys integration
    string public constant IRYS_NETWORK = "sepolia";
    string public constant APP_NAME = "Irys-Linktree";
    string public constant APP_VERSION = "2.0.0";

    // Modifiers
    modifier onlyProfileOwner() {
        require(profiles[msg.sender].isActive, "No active profile found");
        _;
    }

    modifier onlyValidUsername(string memory username) {
        require(bytes(username).length >= 3, "Username too short");
        require(bytes(username).length <= 20, "Username too long");
        require(usernameToAddress[username] == address(0), "Username already taken");
        _;
    }

    modifier onlyPremium() {
        require(profiles[msg.sender].isPremium, "Premium subscription required");
        require(profiles[msg.sender].premiumExpiresAt > block.timestamp, "Premium subscription expired");
        _;
    }

    /**
     * @dev Create a new linktree profile
     * @param username Unique username for the profile
     * @param displayName Display name for the profile
     * @param irysTransactionId Irys transaction ID containing the profile data
     */
    function createProfile(
        string memory username,
        string memory displayName,
        string memory irysTransactionId
    ) external onlyValidUsername(username) nonReentrant {
        require(bytes(irysTransactionId).length > 0, "Invalid Irys transaction ID");
        
        LinktreeProfile memory newProfile = LinktreeProfile({
            username: username,
            displayName: displayName,
            irysTransactionId: irysTransactionId,
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            isActive: true,
            isVerified: false,
            isPremium: false,
            premiumExpiresAt: 0,
            totalViews: 0,
            totalClicks: 0,
            metadata: ""
        });

        profiles[msg.sender] = newProfile;
        usernameToAddress[username] = msg.sender;
        totalProfiles++;

        emit LinktreeCreated(msg.sender, username, irysTransactionId);
    }

    /**
     * @dev Update an existing linktree profile
     * @param irysTransactionId New Irys transaction ID with updated data
     */
    function updateProfile(string memory irysTransactionId) external onlyProfileOwner nonReentrant {
        require(bytes(irysTransactionId).length > 0, "Invalid Irys transaction ID");
        
        profiles[msg.sender].irysTransactionId = irysTransactionId;
        profiles[msg.sender].updatedAt = block.timestamp;

        emit LinktreeUpdated(msg.sender, profiles[msg.sender].username, irysTransactionId);
    }

    /**
     * @dev Delete a linktree profile
     */
    function deleteProfile() external onlyProfileOwner nonReentrant {
        string memory username = profiles[msg.sender].username;
        
        delete usernameToAddress[username];
        delete profiles[msg.sender];
        delete analytics[msg.sender];
        
        totalProfiles--;

        emit LinktreeDeleted(msg.sender, username);
    }

    /**
     * @dev Update profile metadata (Premium feature)
     * @param metadata JSON metadata string
     */
    function updateMetadata(string memory metadata) external onlyProfileOwner onlyPremium {
        profiles[msg.sender].metadata = metadata;
    }

    /**
     * @dev Subscribe to premium features
     */
    function subscribePremium() external payable onlyProfileOwner nonReentrant {
        require(msg.value >= premiumPrice, "Insufficient payment for premium");
        
        uint256 currentExpiry = profiles[msg.sender].premiumExpiresAt;
        uint256 newExpiry = currentExpiry > block.timestamp ? 
            currentExpiry + premiumDuration : 
            block.timestamp + premiumDuration;
        
        profiles[msg.sender].isPremium = true;
        profiles[msg.sender].premiumExpiresAt = newExpiry;

        emit PremiumSubscription(msg.sender, true, newExpiry);
    }

    /**
     * @dev Record analytics data
     * @param username Username to record analytics for
     * @param views Number of views to add
     * @param clicks Number of clicks to add
     * @param linkId Optional link ID for specific link analytics
     */
    function recordAnalytics(
        string memory username,
        uint256 views,
        uint256 clicks,
        string memory linkId
    ) external {
        address profileOwner = usernameToAddress[username];
        require(profileOwner != address(0), "Profile not found");
        require(profiles[profileOwner].isActive, "Profile not active");

        // Update global analytics
        totalViews += views;
        totalClicks += clicks;

        // Update profile analytics
        profiles[profileOwner].totalViews += views;
        profiles[profileOwner].totalClicks += clicks;

        // Update user analytics
        analytics[profileOwner].views += views;
        analytics[profileOwner].clicks += clicks;
        analytics[profileOwner].lastUpdated = block.timestamp;

        // Update specific link analytics if provided
        if (bytes(linkId).length > 0) {
            analytics[profileOwner].linkClicks[linkId] += clicks;
        }

        emit AnalyticsUpdated(profileOwner, username, views, clicks);
    }

    /**
     * @dev Verify a profile (Owner only)
     * @param username Username to verify
     */
    function verifyProfile(string memory username) external onlyOwner {
        address profileOwner = usernameToAddress[username];
        require(profileOwner != address(0), "Profile not found");
        
        profiles[profileOwner].isVerified = true;
        emit ProfileVerified(profileOwner, username);
    }

    /**
     * @dev Get profile information
     * @param username Username to get profile for
     * @return profile Profile information
     */
    function getProfile(string memory username) external view returns (LinktreeProfile memory profile) {
        address profileOwner = usernameToAddress[username];
        require(profileOwner != address(0), "Profile not found");
        return profiles[profileOwner];
    }

    /**
     * @dev Get profile by address
     * @param profileOwner Address of the profile owner
     * @return profile Profile information
     */
    function getProfileByAddress(address profileOwner) external view returns (LinktreeProfile memory profile) {
        require(profiles[profileOwner].isActive, "Profile not found");
        return profiles[profileOwner];
    }

    /**
     * @dev Get analytics for a profile
     * @param username Username to get analytics for
     * @return views Total views
     * @return clicks Total clicks
     * @return lastUpdated Last update timestamp
     */
    function getAnalytics(string memory username) external view returns (
        uint256 views,
        uint256 clicks,
        uint256 lastUpdated
    ) {
        address profileOwner = usernameToAddress[username];
        require(profileOwner != address(0), "Profile not found");
        
        Analytics storage userAnalytics = analytics[profileOwner];
        return (userAnalytics.views, userAnalytics.clicks, userAnalytics.lastUpdated);
    }

    /**
     * @dev Get link-specific analytics (Premium feature)
     * @param linkId Link ID to get analytics for
     * @return clicks Number of clicks for the specific link
     */
    function getLinkAnalytics(string memory linkId) external view onlyProfileOwner onlyPremium returns (uint256 clicks) {
        return analytics[msg.sender].linkClicks[linkId];
    }

    /**
     * @dev Check if username is available
     * @param username Username to check
     * @return available True if username is available
     */
    function isUsernameAvailable(string memory username) external view returns (bool available) {
        return usernameToAddress[username] == address(0);
    }

    /**
     * @dev Get contract statistics
     * @return _totalProfiles Total number of profiles
     * @return _totalViews Total views across all profiles
     * @return _totalClicks Total clicks across all profiles
     */
    function getContractStats() external view returns (
        uint256 _totalProfiles,
        uint256 _totalViews,
        uint256 _totalClicks
    ) {
        return (totalProfiles, totalViews, totalClicks);
    }

    /**
     * @dev Update premium subscription price (Owner only)
     * @param newPrice New price in wei
     */
    function updatePremiumPrice(uint256 newPrice) external onlyOwner {
        premiumPrice = newPrice;
    }

    /**
     * @dev Update premium subscription duration (Owner only)
     * @param newDuration New duration in seconds
     */
    function updatePremiumDuration(uint256 newDuration) external onlyOwner {
        premiumDuration = newDuration;
    }

    /**
     * @dev Withdraw contract balance (Owner only)
     */
    function withdrawBalance() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @dev Emergency pause functionality (Owner only)
     * @param paused Whether to pause the contract
     */
    function setPaused(bool paused) external onlyOwner {
        // This would require implementing Pausable from OpenZeppelin
        // For now, this is a placeholder for future implementation
    }

    // Receive function to accept ETH
    receive() external payable {
        // Accept ETH payments for premium subscriptions
    }

    // Fallback function
    fallback() external payable {
        revert("Function not found");
    }
} 