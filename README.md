# GitHub Splits: Collaborative Code Attribution and Reward System

This project allows developers to attribute and reward contributors for code they've forked and modified. It uses a smart contract to manage shares and distribute funds to GitHub users who have contributed to the codebase.

## Features

- Connect your Ethereum wallet
- Add GitHub usernames and their corresponding shares
- View share distribution
- Claim funds (for contributors)
- Display original and modified code for attribution

## Getting Started

1. Fork this repository
2. Clone your forked repository
3. Install dependencies:

```bash
npm install
# or
yarn install
```

4. Create a `.env.local` file in the root directory and add your contract address:

```
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address_here
```

5. Run the development server:

```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Using GitHub Splits

1. Connect your Ethereum wallet
2. Add GitHub usernames of contributors and their corresponding shares
3. Display the original code you forked and your modifications
4. Contributors can claim their shares by connecting their wallet and providing their GitHub username

## Forking and Customizing

To use GitHub Splits for your own project:

1. Fork this repository
2. Deploy your own instance of the GitHubSplits smart contract
3. Update the `NEXT_PUBLIC_CONTRACT_ADDRESS` in your `.env.local` file
4. Modify the `app/page.tsx` file to display your forked and modified code
5. Update the share distribution according to your project's contributors

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [wagmi Documentation](https://wagmi.sh/)
- [Solidity Documentation](https://docs.soliditylang.org/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
