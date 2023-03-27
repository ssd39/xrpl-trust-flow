## Process

Checkout:  [https://www.xrpltrust.xyz/](https://www.xrpltrust.xyz/)

1.  Login to the Dapp using the Xumm wallet, where you will be shown your ongoing escrow as well as past escrow.
2. Easily create a new condition via our drag and drop interface with node based logic it is easily  to create the logic for the escrow, you can save your logic to use in multiple escrows
3. Now the user can use this condition on a escrow and our workers will check whether the condition has been satisfied or not and whenever the conditions are satisfied the other party is notified so they can claim the escrow. 

## Introduction

Our project, the UI for Escrow, is a revolutionary solution that simplifies the process of creating and managing escrows by providing a user-friendly interface built on top of the XRP Ledger (XRPL).

Traditionally, creating and managing escrows has been a complicated process that requires manual coding and checking. This can be time-consuming and error-prone, making it difficult for users to manage their escrows efficiently. With our project, we aim to eliminate these challenges by providing a drag-and-drop based interface that makes it easy to create and manage escrows.

Our project is designed to be intuitive and easy to use, even for users with no programming experience. Users can simply drag and drop conditions onto a canvas and define the specific actions that need to be completed before funds are released. This eliminates the need for manual coding and ensures that the conditions are set correctly.


## Why 

Traditional methods of managing escrows can be expensive and inaccessible for many businesses and individuals who do not have the resources to hire a programmer or financial expert. This creates a barrier to entry for those who want to utilize escrows to secure their transactions and can lead to unnecessary delays in the release of funds..

Our UI for Escrow addresses these challenges by providing a simplified and intuitive interface that eliminates the need for manual coding and checking. By allowing users to drag and drop conditions and actions onto a canvas, our project streamlines the process of creating and managing escrows, making it accessible to a wider range of users.

Moreover, our solution is built on top of the XRP Ledger (XRPL), which is known for its speed, reliability, and security. This ensures that escrows are managed efficiently and securely, reducing the risk of fraud or errors that can occur with traditional methods.

## Architecture

![diagram](https://i.ibb.co/tChwfPM/Architexture.png)

1.  Decentralized Platform: The platform is built to be decentralized, it is designed to be distributed across multiple nodes in a network and all the payment + main escrow logic is on the XRP ledger . This helps to ensure that the platform is resilient to attacks and can continue to function even if some nodes go offline.
    
2.  Worker System: The platform uses a worker system to monitor the conditions of escrows. Workers are nodes that are responsible for monitoring specific escrows and checking whether the conditions have been met. The workers receive tasks via pubsub, which is a publish-subscribe messaging system that allows for efficient communication between nodes.
    
3.  Escrow Condition Preimage: The escrow condition preimage is stored on the XRPL via the createEscrow transaction. This helps to ensure that the conditions of the escrow are secure and cannot be tampered with.
    
4.  EscrowFinish Transaction: When the conditions of the escrow have been met, the escrowFinish transaction is executed to release the funds. The claimer can then claim the funds by revealing the secret that unlocks the escrow.
    
5.  Notifications: The platform sends notifications to the receiving party when the conditions of the escrow have been met. This ensures that the receiving party is aware that the funds are available and can claim them.

## Attractions


1.  User-Friendly Interface: The drag-and-drop interface of the platform makes it easy for users to create and manage escrows without needing to manually write conditions or check them. This user-friendly approach makes it easy for users of all skill levels to participate in escrow transactions.
    
2.  Automation: The platform's worker system automates the process of checking escrow conditions. This means that users do not need to manually monitor the conditions of the escrow or worry about whether the funds will be released correctly.
    
3.  Decentralization: The platform is built to be decentralized, which means that it is not controlled by a single entity or organization. This helps to ensure that the platform is resilient to attacks and that users can participate in escrow transactions without needing to trust a centralized authority.
    
4.  Security: The escrow conditions are stored on the XRPL, which is a secure and tamper-proof ledger. This helps to ensure that the conditions of the escrow cannot be modified or manipulated.
    
5.  Efficiency: The use of the XRPL and the worker system helps to make the escrow process more efficient. Transactions can be processed quickly, and the use of automation helps to reduce the potential for errors or delays.

## Challenges we ran into 😏

-   Building a scalable architecture so that we can scale it easily in a decentralized way 
-   Parsing the drag and drop graph in the backend in an efficient way

## Upcoming Features

- Escrow Analytics: The platform could provide escrow analytics and reporting tools to help users track and analyze their escrow transactions. This could help users to make more informed decisions about their escrow transactions and identify any areas where they could improve their processes.
    
-  Improved Notification System: The platform's notification system could be enhanced to provide users with more detailed and customizable notifications. Users could choose to receive notifications via email, SMS, or other messaging systems, and could set custom notifications for specific escrow conditions.
-  Escrow Arbitration: Adding an arbitration system could help to resolve disputes between parties in escrow transactions. Users could select an arbitrator when creating an escrow, and the arbitrator could review the conditions and make a decision if the conditions are not met or if a dispute arises.
    
- API Integration: Integrating with other platforms and APIs could help to expand the functionality of the platform. For example, integrating with payment processors could enable users to fund their escrow transactions using credit cards or other payment methods