cd ../project
rm -rf node_modules package-lock.json
npm install . --no-save
echo "AtmosphericX dependencies installed successfully. You can now run the project using 'run.sh' under build-tools."
read -p "Press [Enter] key to exit..."