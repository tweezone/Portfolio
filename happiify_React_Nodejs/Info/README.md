- How to run the project using your computer?
  After clone the project to your computer, you might need these steps for running it:
   1. Install react-app-rewire-less which rewire create-react-app to use LESS.
      $ npm install --save react-app-rewire-less
   2. Install react-app-rewired which tweak the create-react-app webpack config(s) without using 'eject' and without 
      creating a fork of the react-scripts:
      $ npm install --save react-app-rewired 
   3. Sometimes (at least right now Jan 24, 2019) react-scripts@2.1.2 (updated on Dec 21, 2018) is not compatible
      with this project. Because after clone the project, you have to do "$ npm install" to install all of plug-ins,
      then react-scripts@2.1.2 is in. So, you need to downgrade it.
      $ npm install --save react-scripts@2.1.1 
      Maybe in the future, you can use the newest version. 
