import CryptoLayout from '@/components/crypto/CryptoLayout';

export const metadata = {
  title: 'Crypto CSV Analyzer',
  description: 'Analyze cryptocurrency CSV data with powerful charts and statistics',
};

export default function CryptoAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <CryptoLayout>
      <div className="w-full pt-[65px]">{children}</div>
    </CryptoLayout>
  );
}
