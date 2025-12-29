import MarketplaceABI from '../abis/Marketplace.json';
import FactoryABI from '../abis/TokenFactory.json';


export const FACTORY_ADDRESS =
  process.env.NEXT_PUBLIC_FACTORY_ADDRESS!;

export const MARKETPLACE_ADDRESS =
  process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS!;

export const FactoryConfig = {
  address: FACTORY_ADDRESS,
  abi: FactoryABI,
};

export const MarketplaceConfig = {
  address: MARKETPLACE_ADDRESS,
  abi: MarketplaceABI,
};