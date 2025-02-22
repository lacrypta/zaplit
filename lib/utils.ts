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

  // Make payment
  try {
    // create NWC client for sender
    const nwcClientPayer = new nwc.NWCClient({
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
  }
}
