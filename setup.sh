cd api/; pnpm install;
cd ../frontend/; pnpm install;
cd ..; 
npx concurrently \"cd api && pnpm dev\" \"cd client && pnpm dev\"