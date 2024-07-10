

async function uploadImage(instagramAccountId,) {
    const form = new FormData();
    form.append('image', fs.createReadStream(imagePath), 'image.jpg');
  
    try {
      const response = await axios.post(
        `https://graph.facebook.com/v15.0/${instagramAccountId}/media`,
        form,
        {
          headers: {
            ...form.getHeaders(),
            'Authorization': `Bearer ${userAccessToken}`
          }
        }
      );
      return response.data.id;
    } catch (error) {
      console.error('Error uploading image:', error.response ? error.response.data : error.message);
      throw error;
    }
  }