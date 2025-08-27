// app/components/ExplorerButton.tsx

interface ExplorerButtonProps {
  address?: string;
  txHash?: string;
  className?: string;
}

export function ExplorerButton({ address, txHash, className = "" }: ExplorerButtonProps) {
  const getExplorerUrl = () => {
    if (address) {
      return `https://allo.info/address/${address}`;
    }
    if (txHash) {
      return `https://allo.info/tx/${txHash}`;
    }
    return '#';
  };

  return (
    <a
      href={getExplorerUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center w-5 h-5 rounded hover:bg-ink-100 dark:hover:bg-dark-border transition-colors duration-200 ${className}`}
      title="View on Allo.info"
    >
      <svg className="w-3 h-3 text-ink-400 dark:text-dark-text-muted transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  );
}
