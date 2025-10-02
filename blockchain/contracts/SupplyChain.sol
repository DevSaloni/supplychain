// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {
    enum Stage { None, Manufactured, InTransit, ReceivedForSale }

    struct StatusUpdate {
        string stage;
        string role;
        string location;
        address updater;
        uint timestamp;
        uint priceAtStage;
    }

    struct RoleAddresses {
        address manufacturer;
        address transporter;
        address retailer;
    }

    struct Product {
        string productID;
        string batchNumber;
        string name;
        string origin;
        string destination;
        uint basePrice;
        uint transportFee;
        uint retailerFee;
        RoleAddresses roles;
        Stage currentStage;
        bool isVerified;
        uint approvalCount;
    }

    // Storage
    mapping(string => Product) public products;
    mapping(string => StatusUpdate[]) public productHistory;     // history per product
    mapping(string => address[]) public productVerifiedRoles;    // verified roles per product
    mapping(string => mapping(address => bool)) public approvals;

    mapping(address => bool) public manufacturers;
    mapping(address => bool) public transporters;
    mapping(address => bool) public retailers;
    
    // track all product IDs
    string[] public productIDs;

    // Events
    event ProductAdded(string productID, string batchNumber, address manufacturer, uint timestamp);
    event StatusUpdated(string productID, string stage, string location, address updater, uint timestamp, uint price);
    event ProductVerified(string productID, string batchNumber, address verifier, uint timestamp, bool isVerified);

    // Role registration
    function registerAsManufacturer() public { manufacturers[msg.sender] = true; }
    function registerAsTransporter() public { transporters[msg.sender] = true; }
    function registerAsRetailer() public { retailers[msg.sender] = true; }

    // Optimized addProduct with fewer stack variables
    function addProduct(
        string memory _productID,
        string memory _batchNumber,
        string memory _name,
        string memory _origin,
        string memory _destination,
        uint _basePrice,
        address _transporter,
        address _retailer
    ) public {
        require(manufacturers[msg.sender], "Only manufacturer");
        Product storage p = products[_productID];
        require(p.currentStage == Stage.None, "Product exists");

        p.productID = _productID;
        p.batchNumber = _batchNumber;
        p.name = _name;
        p.origin = _origin;
        p.destination = _destination;
        // p.image = _image;
        p.basePrice = _basePrice;
        p.roles.manufacturer = msg.sender;
        p.roles.transporter = _transporter;
        p.roles.retailer = _retailer;
        p.currentStage = Stage.Manufactured;

        // Log initial history outside struct
        productHistory[_productID].push(StatusUpdate("Manufactured", "Manufacturer", _origin, msg.sender, block.timestamp, _basePrice));
        
        //push  all productIDS in array
        productIDs.push(_productID);

        emit ProductAdded(_productID, _batchNumber, msg.sender, block.timestamp);
    }

    function updateStatus(
        string memory _productID,
        string memory _status,
        string memory _location,
        uint _transportFee
    ) public {
        Product storage p = products[_productID];
        require(msg.sender == p.roles.transporter, "Not transporter");
        require(p.currentStage == Stage.Manufactured, "Not manufactured");
        require(p.isVerified, "Not verified");

        p.transportFee = _transportFee;
        productHistory[_productID].push(StatusUpdate(_status, "Transporter", _location, msg.sender, block.timestamp, _transportFee));
        p.currentStage = Stage.InTransit;

        emit StatusUpdated(_productID, _status, _location, msg.sender, block.timestamp, _transportFee);
    }

    function markReceived(
        string memory _productID,
        string memory _location,
        uint _retailerFee
    ) public {
        Product storage p = products[_productID];
        require(msg.sender == p.roles.retailer, "Not retailer");
        require(p.currentStage == Stage.InTransit, "Not in transit");

        p.retailerFee = _retailerFee;
        productHistory[_productID].push(StatusUpdate("Received & For Sale", "Retailer", _location, msg.sender, block.timestamp, _retailerFee));
        p.currentStage = Stage.ReceivedForSale;

        emit StatusUpdated(_productID, "Received & For Sale", _location, msg.sender, block.timestamp, _retailerFee);
    }

    function verifyProduct(string memory _productID) public {
        Product storage p = products[_productID];
        require(msg.sender == p.roles.manufacturer || msg.sender == p.roles.transporter || msg.sender == p.roles.retailer, "Not authorized");
        require(!approvals[_productID][msg.sender], "Already approved");

        approvals[_productID][msg.sender] = true;
        p.approvalCount++;
        productVerifiedRoles[_productID].push(msg.sender);

        if (
            approvals[_productID][p.roles.manufacturer] &&
            approvals[_productID][p.roles.transporter] &&
            approvals[_productID][p.roles.retailer]
        ) {
            p.isVerified = true;
        }

        emit ProductVerified(_productID, p.batchNumber, msg.sender, block.timestamp, p.isVerified);
    }

    function getProductHistory(string memory _productID) public view returns (StatusUpdate[] memory) {
        return productHistory[_productID];
    }

    function getVerifiedRoles(string memory _productID) public view returns (address[] memory) {
        return productVerifiedRoles[_productID];
    }

    //get total Number of  product count 
    function getProductCount() public view returns(uint){
        return productIDs.length;
    }
}
