import { supabase } from './supabaseService';

// Vervang dit door je echte Stripe Price ID (bv. van je Stripe Dashboard)
// Dit kan ook via een environment variable worden ingeladen
const STRIPE_PRICE_ID = 'price_1234567890'; 

export const createCheckoutSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error("Je moet ingelogd zijn om te upgraden.");
  }

  try {
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: {
        price_id: STRIPE_PRICE_ID,
        return_url: window.location.origin, // Redirect terug naar de app
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