import bcrypt from 'bcryptjs';

async function testBcrypt() {
  const password = 'Password123!';
  const storedHash = '$2a$10$eYDXrLKtyGlM1S94uhRAdOHkJ67mzoRQPZ/S6FZv8aM3xqkXBx5N.';

  console.log('Testing bcrypt...');
  console.log('Password:', password);
  console.log('Stored hash:', storedHash);

  const isMatch = await bcrypt.compare(password, storedHash);
  console.log('Password match:', isMatch);

  const newSalt = await bcrypt.genSalt(10);
  const newHash = await bcrypt.hash(password, newSalt);
  console.log('Newly generated hash:', newHash);

  const newMatch = await bcrypt.compare(password, newHash);
  console.log('New hash match:', newMatch);
}

testBcrypt().catch(console.error);