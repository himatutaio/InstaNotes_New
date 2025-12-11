
import { supabase } from './supabaseService';

// Placeholder Price IDs (These should be replaced with your actual Stripe Price IDs)
const PRICE_SUBSCRIPTION = 'price_1234567890_monthly'; 
const PRICE_ONETIME = 'price_1234567890_onetime';

export type PaymentType = 'subscription' | 'payment';

export const createCheckoutSession = async (type: PaymentType = 'subscription') => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error("Je moet ingelogd zijn om te upgraden.");
  }

  const priceId = type === 'subscription' ? PRICE_SUBSCRIPTION : PRICE_ONETIME;
  
  // Append the payment type to the return URL so the frontend knows how to handle the success state
  const returnUrl = `${window.location.origin}?payment_type=${type === 'subscription' ? 'sub' : 'onetime'}`;

  try {
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: {
        price_id: priceId,
        return_url: returnUrl, 
      },
    });

    if (error) {
      console.error('Payment Service Error:', error);
      throw new Error("Kon betaalsessie niet starten. Probeer het later.");
    }

    if (data?.url) {
      window.location.href = data.url;
    } else {
      throw new Error('Geen checkout URL ontvangen van server.');
    }
  } catch (err: any) {
    console.error(err);
    throw err;
  }
};
