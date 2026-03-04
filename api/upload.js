const blob = await put(file.name, file, {
  access: 'public',
  addRandomSuffix: true,
});
