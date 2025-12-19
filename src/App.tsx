const checkProStatus = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", userId)
      .in("status", ["active", "trialing"])
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching subscription status:", error);
      setIsPro(false);
      return;
    }

    if (data?.status === "active" || data?.status === "trialing") {
      setIsPro(true);
    } else {
      setIsPro(false);
    }
  } catch (err) {
    console.error("Unexpected error checking subscription status:", err);
    setIsPro(false);
  }
};