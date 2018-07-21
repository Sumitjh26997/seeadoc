# seeadoc

- using terminal/cmd: chmod 400 seeadoc.pem
- ssh -i "seeadoc.pem" ec2-user@ec2-13-232-149-183.ap-south-1.compute.amazonaws.com
in the same directory or if it's useful create an alias or an executable in /usr/local/bin  with above command
- please create a new branch before committing a new change
- dependencies for project
1.) sudo apt install nodejs
2.) sudo apt install npm
3.) sudo npm -g install ionic cordova
- to test go to working directory and run ionic serve
- to test the api 
  1.) paste appointment-api-v1-master in your webroot
  2.) cd into api directory 
  3.) npm install 
  4.) npm start
  
