import { Request, Response } from "express";
import DesignProject from "../schemas/designProject";

const deleteProjectHandler = [
    async (req: Request, res: Response) => {
        const userId = req.params.userId;
        const projectId = req.params.projectId;
      
        try {
          if (!userId || !projectId) {
            return res.status(400).json({ error: "User ID or Project ID is missing" });
          }
      
          const design = await DesignProject.findOne({ userId: userId });
      
          if (design) {
            // Find the project to delete by its _id
            const projectIndex = design.projects.findIndex((project) => project._id == projectId);
      
            if (projectIndex !== -1) {
              // Remove the project from the projects array
              design.projects.splice(projectIndex, 1);
      
              if (design.projects.length === 0) {
                // If there are no more projects, remove the entire design document
                await DesignProject.findOneAndDelete({ userId: userId });
              } else {
                await design.save(); // Save the updated design document
              }
              console.error("Usunieto projekt");
              return res.status(200).json({ message: "Project deleted successfully" });
            }
          }
      
          return res.status(404).json({ error: "Project not found" });
        } catch (error) {
          console.error("Error while deleting project", error);
          return res.status(500).json({ error: "An error occurred while deleting the project" });
        }
      }
];

export default deleteProjectHandler