# 🚀 Getting Started with Marketplace UI

Welcome to **Marketplace UI** - your gateway to creating and publishing web3 marketplaces, powered by Next.js 13.

![Marketplace Screenshot](./thumbnail.png)

## Explore the Demo

Before diving in, take a look at our demo for a preview of what you can achieve with Marketplace UI. 
[Explore the Demo](https://demo.cometh.io/marketplace/marketplace).

## Setting Up Your Project

### 1. Initial Setup:

First, install the required dependencies and start application.

```bash
# Install dependencies
yarn

# Start the application
yarn dev
```


### 2. Environment Variable Configuration
Environment variables are typed in `env.ts` and defined in the `.env` file. Ensure the **`.env`** file is correctly defined during both build and runtime."

Based on the provided `.env.example`, here's an example of how your `.env` file should look:

```sh
NEXT_PUBLIC_NODE_ENV=development
NEXT_PUBLIC_BASE_PATH=""
NEXT_PUBLIC_RPC_URL="<YOUR_RPC_URL>"
NEXT_PUBLIC_CONTRACT_ADDRESS=<YOUR_ERC_721_CONTRACT_ADDRESS>
NEXT_PUBLIC_NETWORK_ID=<YOUR_NETWORK_ID>
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=<YOUR_WALLET_CONNECT_PROJECT_ID>

# Cometh
NEXT_PUBLIC_COMETH_MARKETPLACE_API_URL="https://api.marketplace.cometh.io/v1"
NEXT_PUBLIC_COMETH_CONNECT_API_KEY=<API_KEY>
NEXT_PUBLIC_MARKETPLACE_API_KEY=<API_KEY>

NEXT_PUBLIC_COINGECKO_API_KEY=<API_KEY>
```
 
🔧 Your keys `NEXT_PUBLIC_MARKETPLACE_API_KEY` and `NEXT_PUBLIC_COMETH_CONNECT_API_KEY` are available in your [cometh dashboard](https://app.cometh.io/), they are usually the same key.

The **NEXT_PUBLIC_COMETH_MARKETPLACE_API_URL** is set by default for the polygon network. If you are on another network, you can find this url in your dashboard.

👉 To add *Cometh Connect* in your marketplace, you need to activate the product on your project: [Cometh Connect](https://docs.cometh.io/connect/quickstart/getting-started).

The boilerplate uses RainbowKit which requires a project ID to work. You can get your own project id for the `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`

Setting up `NEXT_PUBLIC_RPC_URL` is not mandatory but we strongly advise so get a private RPC endpoint you can use for your marketplace (Alchemy, Infura...).

### 3. Customizing Your Marketplace

#### **Manifest:** 
Use the `manifests/index.ts` file to configure essential aspects of your marketplace. It lets you set:
- The name of your collection.
- Asset attribute configurations.
- Network details (update if not on polygon).
- Currency settings. It's possible to use your own ERC20 instead of the native currency. 

🔧 **Important:** It's crucial to customize this `index.ts` file to align with the specifics of your marketplace.

#### **Global configuration:**
You can manage the configuration of your site directly from the `site.ts` file. This allows you to update site name, metadatas and links.

```typescript
import { manifest } from "@/manifests"

export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: `${manifest.collectionName} | Marketplace`,
  description: `Discover ${manifest.collectionName}, the ultimate Web3 marketplace platform.`,
  mainNav: [
    {
      title: "Marketplace",
      href: "/marketplace",
    },
  ],
}
```

#### **Theming:**
The appearance of your marketplace is fully customizable via the provided CSS file. Customize the `styles/globals.css` and `tailwind.config.js` files to define colors, fonts, etc.

Additionally, for a deeper dive into theming and styling, we invite you to consult the [shacdn documentation](https://ui.shadcn.com/docs/theming).

### 3. FAQ

#### How do I sponsor my users transactions?

To sponsor the transactions of your users, you will first need to [configure it](https://docs.cometh.io/marketplace/resources/sponsoring-transactions) in your project settings. Once this is done, you can set the field `areContractsSponsored` in your manifest file to true.

#### How do I use my own ERC20 token on the marketplace?

In your manifest file, you will need to use currency settings such as this:

```typescript
// Set to true if you want to use the native token for orders
useNativeTokenForOrders: false,
// The ERC20 token used if useNativeTokenForOrders is false
erc20: {
  id: "mytoken-id", // The id of the token used by CoinGecko
  name: "My Token",
  symbol: "MTK",
  address: "0x42f671d85624b835f906d3aacc47745795e4b4f8",
  // put your logo in the '/public/tokens' folder and update the following line (example: "mytoken.png")
  thumb: "",
},
```

#### How do I add fiat currency to my marketplace?
In your manifest file, you will need to use currency settings such as this:

```typescript
fiatCurrency: {
  enable: true,
  currencyId: "USD",
  currencySymbol: "$",
},
```

You can generate your own API key on the [CoinGecko website](https://docs.coingecko.com/v3.0.1/reference/setting-up-your-api-key).
If you use ERC20 token, you need to manually add the id of the token specified by CoinGecko. [e.g for bitcoin](https://www.dropbox.com/scl/fi/gfnyt5momih7f4dp05101/Capture-d-cran-2024-03-05-20.29.49.png?rlkey=w5w5wjmvagqhdyekrknnxt1i9&dl=0).

All supported `currencyId` can be found in `types/currencies.ts`.


#### What is an RPC and why would I need one?

An RPC node is the entry point of calls made to the blockchain. By default our tools will use public free RPC urls. However, to avoid throttling and performance issues in production, it is strongly recommended to find a better private RPC dedicated to your app. 