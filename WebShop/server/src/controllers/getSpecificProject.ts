import { Request, Response } from "express";
import DesignProject from "../schemas/designProject";

const getSpecificProjectHandler = [
    async (req: Request, res: Response) => {
        const userId = req.query.userId;
        const projectName =  req.query.projectName;
      
        try {
          if (!userId || !projectName  ) {
            return res.status(400).json({ error: "User ID or Project ID is missing" });
          }
      
          const userProjects = await DesignProject.findOne({ userId: userId });
      
          if (!userProjects) {
            return res.status(404).json({ error: "User not found or has no projects" });
          }
      
          const specificProject = userProjects.projects.find(
            (project) => project.designName === projectName 
          );
      
          if (specificProject) {
            return res.status(200).json({ project: specificProject });
          } else {
            return res.status(404).json({ error: "Project not found" });
          }
        } catch (error) {
          console.error("Error while retrieving specific project", error);
          return res.status(500).json({ error: "An error occurred while retrieving the project" });
        }
      }
];

export default getSpecificProjectHandler