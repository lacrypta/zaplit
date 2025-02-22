import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { nwc } from '@getalby/sdk';
import { Share } from '@/types/share';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function collectShare(share: Share, nwcClientReceiver: nwc.NWCClient) {
  // If share is not idle, skip
  if (share.status !== 'idle') {
    console.warn('Share is not idle');
    return;
  }

  // Set share status to paying
  share.status = 'paying';
  let nwcClientPayer: nwc.NWCClient | null = null;

  // Make payment
  try {
    // create NWC client for sender
    nwcClientPayer = new nwc.NWCClient({
      nostrWalletConnectUrl: share.member.nwcCredentials,
    });

    // Get payment request from receiver
    const paymentRequest = await nwcClientReceiver.makeInvoice({ amount: share.amount });

    // Pay invoice
    await nwcClientPayer.payInvoice(paymentRequest);
    share.status = 'paid';
  } catch (err) {
    console.error('Failed to pay invoice', err);
    share.status = 'failed';
  } finally {
    // Close NWC client when finished
    if (nwcClientPayer !== null) {
      nwcClientPayer.close();
    }
  }
}

export function generateShortId(str: string): string {
  const normalized = str.toLowerCase().replace(/\s+/g, '');

  // Create a numeric hash (DJB2 algorithm)
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash << 5) - hash + normalized.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Convert to base36 (alphanumeric) and take first 6 chars
  return Math.abs(hash).toString(36).substring(0, 6);
}
