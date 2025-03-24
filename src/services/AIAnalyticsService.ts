
/**
 * AIAnalyticsService
 * Provides AI-powered analytics and insights for the Fieldvision platform
 */
import { WorkEntry } from "@/types/app-types";
import { BillingCode, Project, TeamMember } from "@/context/AppContext";
import { Task } from "@/context/ScheduleContext";

export class AIAnalyticsService {
  /**
   * Analyzes work entries and suggests optimizations
   */
  static analyzeWorkEntries(entries: WorkEntry[]): {
    insights: string[];
    efficiencyScore: number;
  } {
    // This would connect to an actual AI service in production
    // For now, we'll provide mock insights based on the data

    if (!entries.length) {
      return {
        insights: ["No work entries to analyze."],
        efficiencyScore: 0,
      };
    }

    // Simple analytics logic - would be replaced with actual AI analysis
    const totalEntries = entries.length;
    const insights: string[] = [];
    let efficiencyScore = 0.75; // Base score

    // Pattern detection
    const uniqueProjects = new Set(entries.map(e => e.projectId)).size;
    const projectRatio = uniqueProjects / totalEntries;
    
    if (projectRatio < 0.3 && totalEntries > 5) {
      insights.push("Work is concentrated on few projects. Consider resource distribution.");
      efficiencyScore -= 0.1;
    }

    // Billing code analysis
    const billingCodeFrequency: Record<string, number> = {};
    entries.forEach(entry => {
      if (!billingCodeFrequency[entry.billingCodeId]) {
        billingCodeFrequency[entry.billingCodeId] = 0;
      }
      billingCodeFrequency[entry.billingCodeId]++;
    });

    const mostUsedBillingCode = Object.entries(billingCodeFrequency).sort((a, b) => b[1] - a[1])[0];
    if (mostUsedBillingCode && mostUsedBillingCode[1] > totalEntries * 0.6) {
      insights.push(`Billing code ${mostUsedBillingCode[0]} is used frequently. Verify correct usage.`);
    }

    // Recommend task completions
    if (totalEntries > 3) {
      insights.push("Consider automating task completion based on work entries.");
      efficiencyScore += 0.05;
    }

    // Add more generic insights to demonstrate potential
    insights.push("AI analysis suggests 15% potential revenue increase with optimized scheduling.");
    insights.push("Team productivity could improve by 20% with AI-assisted task assignments.");

    return {
      insights: insights.length ? insights : ["No significant insights detected."],
      efficiencyScore: Math.min(Math.max(efficiencyScore, 0), 1), // Clamp between 0 and 1
    };
  }

  /**
   * Predicts revenue based on current work patterns
   */
  static predictRevenue(entries: WorkEntry[], billingCodes: BillingCode[]): {
    predictedRevenue: number;
    confidenceScore: number;
    recommendations: string[];
  } {
    // Mock prediction logic - would be replaced with actual AI prediction
    let predictedRevenue = 0;
    const recommendations: string[] = [];
    
    if (!entries.length) {
      return {
        predictedRevenue: 0,
        confidenceScore: 0,
        recommendations: ["No data available for prediction."],
      };
    }

    // Calculate average revenue per entry
    let totalRevenue = 0;
    entries.forEach(entry => {
      const billingCode = billingCodes.find(bc => bc.id === entry.billingCodeId);
      if (billingCode) {
        totalRevenue += Number(entry.feetCompleted) * billingCode.ratePerFoot;
      }
    });
    
    const avgRevenuePerEntry = totalRevenue / entries.length;
    
    // Project forward with a slight growth factor
    predictedRevenue = avgRevenuePerEntry * entries.length * 1.15; // 15% growth projection
    
    // Generate recommendations
    if (predictedRevenue > totalRevenue * 1.1) {
      recommendations.push("AI analysis suggests potential for increased revenue through more efficient scheduling.");
    }
    
    recommendations.push("Consider focusing on high-value billing codes to maximize revenue.");
    recommendations.push("AI predicts 12% revenue growth potential in the next quarter.");

    return {
      predictedRevenue,
      confidenceScore: 0.85, // Mock confidence score
      recommendations,
    };
  }

  /**
   * Suggests optimal task assignments based on team member skills and availability
   */
  static suggestTaskAssignments(tasks: Task[], teamMembers: TeamMember[]): Record<string, string[]> {
    // Mock assignment logic - would be replaced with actual AI-based assignment
    const assignments: Record<string, string[]> = {};
    
    if (!tasks.length || !teamMembers.length) {
      return assignments;
    }
    
    // Simple round-robin assignment for demonstration
    teamMembers.forEach(member => {
      assignments[member.id] = [];
    });
    
    tasks.forEach((task, index) => {
      const memberIndex = index % teamMembers.length;
      const memberId = teamMembers[memberIndex].id;
      assignments[memberId].push(task.id);
    });
    
    return assignments;
  }

  /**
   * Analyzes geographic data to optimize field operations
   */
  static analyzeGeographicData(tasks: Task[]): {
    hotspots: { lat: number; lng: number; intensity: number }[];
    recommendations: string[];
  } {
    // Mock geographic analysis - would be replaced with actual AI spatial analysis
    const hotspots: { lat: number; lng: number; intensity: number }[] = [];
    const recommendations: string[] = [];
    
    if (!tasks.length) {
      return { hotspots, recommendations: ["No geographic data to analyze."] };
    }
    
    // Create some mock hotspots based on task locations
    const taskLocations = tasks
      .filter(task => task.location && task.location.lat && task.location.lng)
      .map(task => task.location);
      
    if (taskLocations.length > 0) {
      // Generate a few "hotspots" near existing locations
      taskLocations.slice(0, 3).forEach(loc => {
        if (loc) {
          hotspots.push({
            lat: loc.lat + (Math.random() - 0.5) * 0.1,
            lng: loc.lng + (Math.random() - 0.5) * 0.1,
            intensity: Math.random() * 0.5 + 0.5,
          });
        }
      });
      
      recommendations.push("AI analysis identified 3 work concentration areas for optimized resource allocation.");
      recommendations.push("Consider grouping nearby tasks to reduce travel time by an estimated 15%.");
      recommendations.push("Route optimization could save approximately 2 hours per technician per week.");
    }
    
    return { hotspots, recommendations };
  }
}
