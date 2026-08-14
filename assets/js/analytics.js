(() => {
  const dataLayer = window.dataLayer = window.dataLayer || [];
  window.PGTrack = (event, params = {}) => {
    // Never place raw email, Telegram usernames, names or full PII URLs here.
    dataLayer.push({ event, ...params });
  };
})();