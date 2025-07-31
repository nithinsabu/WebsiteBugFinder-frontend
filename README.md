This is the frontend of Website bug finder. 
Node version 22:

To run, make sure the environment variable is present called VITE_API_URL.
Create a .env file in the root of this project and create a variable VITE_API_URL=<Provide the backend url>

To run the project:
1. Install dependecies: npm install
2. Run the project: npm run dev

To run the docker image:
1. docker build --build-args VITE_API_URL=<Provide backend url>/api -t react-app .
2. docker run -p <PORT>:80 --name <Provide name> react-app

Example run:
docker run -p 5173:80 --name react-app react-app

(Expose port 5173)