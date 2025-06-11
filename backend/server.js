// Add these endpoints to the backend server
app.post('/api/hedera/issue', async (req, res) => {
  const { userAddress, ipfsHash, validUntil } = req.body;
  try {
    await hedera.issueCredential(
      process.env.HEDERA_CONTRACT_ID,
      req.userAddress, // Issuer address from session
      userAddress,
      ipfsHash,
      Math.floor(new Date(validUntil).getTime() / 1000
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Hedera operation failed' });
  }
});

app.post('/api/hedera/request', async (req, res) => {
  const { userAddress, credentialId } = req.body;
  try {
    const result = await hedera.requestAccess(
      process.env.HEDERA_CONTRACT_ID,
      userAddress,
      credentialId
    );
    res.json({ success: true, requestId: result });
  } catch (error) {
    res.status(500).json({ error: 'Hedera operation failed' });
  }
});

app.post('/api/hedera/approve', async (req, res) => {
  const { requestId } = req.body;
  try {
    await hedera.approveAccess(
      process.env.HEDERA_CONTRACT_ID,
      requestId
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Hedera operation failed' });
  }
});
