import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Yield Puzzle Arena',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '8259029a7384a5a544bd06b3f9dc2b7e', // Use a default for dev if missing, but prefer env
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: false, // Standard SPA
});
