@echo off
chcp 65001
"mongoimport.exe" --uri="mongodb://localhost:27017" --db=ncmviewpoints --collection=locations --drop --file=locations.json --jsonArray
"mongoimport.exe" --uri="mongodb://localhost:27017" --db=ncmviewpoints --collection=viewpoints --drop --file=viewpoints.json --jsonArray
echo PLEASE KILL AND RESTART YOUR BACKEND SERVER DEV TASK IF RUNNING!