const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting IrysLinktree contract deployment...");

  // Get the contract factory
  const IrysLinktree = await ethers.getContractFactory("IrysLinktree");
  console.log("📋 Contract factory loaded");

  // Deploy the contract
  console.log("⏳ Deploying IrysLinktree contract...");
  const irysLinktree = await IrysLinktree.deploy();
  
  // Wait for deployment to complete
  await irysLinktree.waitForDeployment();
  
  const contractAddress = await irysLinktree.getAddress();
  console.log("✅ IrysLinktree contract deployed successfully!");
  console.log("📍 Contract Address:", contractAddress);
  console.log("🔗 Network:", network.name);
  console.log("👤 Deployer:", (await ethers.getSigners())[0].address);

  // Verify the deployment
  console.log("🔍 Verifying deployment...");
  const deployedContract = await ethers.getContractAt("IrysLinktree", contractAddress);
  
  // Test basic contract functions
  try {
    const totalProfiles = await deployedContract.totalProfiles();
    const premiumPrice = await deployedContract.premiumPrice();
    const premiumDuration = await deployedContract.premiumDuration();
    const irysNetwork = await deployedContract.IRYS_NETWORK();
    const appName = await deployedContract.APP_NAME();
    const appVersion = await deployedContract.APP_VERSION();

    console.log("✅ Contract verification successful!");
    console.log("📊 Initial Stats:");
    console.log("   - Total Profiles:", totalProfiles.toString());
    console.log("   - Premium Price:", ethers.formatEther(premiumPrice), "ETH");
    console.log("   - Premium Duration:", premiumDuration.toString(), "seconds");
    console.log("   - Irys Network:", irysNetwork);
    console.log("   - App Name:", appName);
    console.log("   - App Version:", appVersion);

  } catch (error) {
    console.error("❌ Contract verification failed:", error.message);
  }

  // Save deployment info
  const deploymentInfo = {
    contractAddress: contractAddress,
    network: network.name,
    deployer: (await ethers.getSigners())[0].address,
    deploymentTime: new Date().toISOString(),
    contractName: "IrysLinktree",
    constructorArgs: [],
    abi: IrysLinktree.interface.formatJson()
  };

  // Write deployment info to file
  const fs = require('fs');
  const path = require('path');
  
  const deploymentsDir = path.join(__dirname, '../deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentFile = path.join(deploymentsDir, `${network.name}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  
  console.log("💾 Deployment info saved to:", deploymentFile);

  // Instructions for next steps
  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📝 Next steps:");
  console.log("1. Update your frontend with the contract address:", contractAddress);
  console.log("2. Verify the contract on Etherscan (if applicable)");
  console.log("3. Test the contract functions");
  console.log("4. Update environment variables with the contract address");
  
  console.log("\n🔗 Contract Explorer Links:");
  if (network.name === 'sepolia') {
    console.log(`   - Sepolia Etherscan: https://sepolia.etherscan.io/address/${contractAddress}`);
  } else if (network.name === 'mainnet') {
    console.log(`   - Etherscan: https://etherscan.io/address/${contractAddress}`);
  }

  return contractAddress;
}

// Handle errors
main()
  .then((contractAddress) => {
    console.log("\n✅ Deployment script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }); 