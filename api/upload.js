const formData = new FormData();
formData.append('file', new File(['test'], 'test.txt', { type: 'text/plain' }));
fetch('/api/upload', { method: 'POST', body: formData })
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
