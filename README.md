# `goTeamManagement` — Team Management Application

This application uses drag and drop functionality to manage various teams of employees

## Getting Started

To get you started you can simply clone the `goTeamManagement` repository and install the dependencies:

### Prerequisites

You need git to clone the `goTeamManagement` repository.

We also use a number of Node.js tools to initialize and test `goTeamManagement`. You must have Node.js
and its package manager (npm) installed. You can get them.

### Clone `goTeamManagement`

Clone the `goTeamManagement` repository using git:

```
git clone https://github.com/gauravmakkar/goTeamManagement.git
cd goTeamManagement
```

### Run the Application

We have preconfigured the project with a simple development web server. The simplest way to start
this server is:

```
npm start
```

Now browse to the app at [`localhost:8001/app`].



### Run the application in debug mode

By default all the resources are injected as minified files, we can
debug the application using gulp tool.

```
gulp inject:css
```

```
gulp inject:js
```

```
npm start
```
