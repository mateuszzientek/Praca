import { Request, Response } from "express";
import DesignProject from "../schemas/designProject";


const getProjectsHandler = [
    async (req: Request, res: Response) => {
        const userId = req.query.userId;
      
        try {
          if (!userId) {
            res.status(400).json({ error: "User ID is missing" });
          }
      
          const projects = await DesignProject.findOne({ userId: userId });
      
          if (projects) {
            projects.projects.reverse();
      
            res.status(200).json({ projects: projects });
          } else {
            res.status(404).json({ error: "No projects found for the user" });
          }
        } catch (error) {
          console.error("Error while saving project", error);
          return res
            .status(500)
            .json({ error: "An error occurred while saving the project" });
        }
      }
];

export default getProjectsHandler