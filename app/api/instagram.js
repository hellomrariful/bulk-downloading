import axios from 'axios';

export default async function handler(req, res) {
  console.log('API route hit');
  const { username } = req.query;
  console.log('Fetching data for username:', username);

  try {
    const response = await axios.get(`https://www.instagram.com/${username}/?__a=1`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Failed to fetch data from Instagram:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from Instagram' });
  }
}
