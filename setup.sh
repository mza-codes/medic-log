cd api/; yarn install;
cd ../frontend/; yarn install;
cd ..; 
npx concurrently \"cd api && yarn dev\" \"cd client && yarn dev\"