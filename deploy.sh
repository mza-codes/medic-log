cd api/ && yarn install
cd ../frontend/ && yarn install
yarn run production
mv build ../api/
# cd ../api 
# yarn start 