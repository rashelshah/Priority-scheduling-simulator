import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calculator, Trash2 } from "lucide-react";

interface Process {
  id: string;
  burstTime: number;
  priority: number;
}

interface ScheduledProcess extends Process {
  waitingTime: number;
  turnaroundTime: number;
  completionTime: number;
}

const Index = () => {
  const [processes, setProcesses] = useState<Process[]>([
    { id: "P1", burstTime: 5, priority: 3 },
    { id: "P2", burstTime: 7, priority: 1 },
    { id: "P3", burstTime: 15, priority: 2 },
  ]);
  
  const [results, setResults] = useState<ScheduledProcess[] | null>(null);

  const handleInputChange = (index: number, field: keyof Process, value: string) => {
    const newProcesses = [...processes];
    if (field === "id") {
      newProcesses[index][field] = value;
    } else {
      newProcesses[index][field] = parseInt(value) || 0;
    }
    setProcesses(newProcesses);
  };

  const runScheduling = () => {
    // Sort by priority (lower number = higher priority)
    const sorted = [...processes].sort((a, b) => a.priority - b.priority);
    
    let currentTime = 0;
    const scheduled: ScheduledProcess[] = sorted.map((process) => {
      const waitingTime = currentTime;
      const turnaroundTime = waitingTime + process.burstTime;
      const completionTime = currentTime + process.burstTime;
      
      currentTime += process.burstTime;
      
      return {
        ...process,
        waitingTime,
        turnaroundTime,
        completionTime,
      };
    });
    
    setResults(scheduled);
  };

  const addProcess = () => {
    const newIdNumber = processes.length > 0 ? Math.max(...processes.map(p => parseInt(p.id.substring(1)))) + 1 : 1;
    setProcesses([...processes, {
      id: `P${newIdNumber}`,
      burstTime: 1,
      priority: 1
    }]);
  };

  const deleteProcess = (index: number) => {
    const newProcesses = [...processes];
    newProcesses.splice(index, 1);
    setProcesses(newProcesses);
  };

  const averageWT = results ? results.reduce((sum, p) => sum + p.waitingTime, 0) / results.length : 0;
  const averageTAT = results ? results.reduce((sum, p) => sum + p.turnaroundTime, 0) / results.length : 0;

  const getProcessColor = (id: string) => {
    const colors = ["process-1-bg", "process-2-bg", "process-3-bg", "process-4-bg", "process-5-bg"];
    const processNumber = parseInt(id.substring(1));
    if (isNaN(processNumber)) {
      return "bg-muted";
    }
    return colors[(processNumber - 1) % colors.length];
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        <header className="text-center space-y-2 mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Calculator className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Priority Scheduler
            </h1>
          </div>
          <p className="text-lg text-white/90">
            Priority Scheduling Simulator
          </p>
        </header>

        {/* Input Section */}
        <Card className="glass-card border-2">
          <CardHeader>
            <CardTitle>Process Details</CardTitle>
            <CardDescription>Enter process information (lower priority number = higher priority)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-left p-3 font-semibold">Process ID</th>
                    <th className="text-left p-3 font-semibold">Burst Time</th>
                    <th className="text-left p-3 font-semibold">Priority</th>
                    <th className="text-left p-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {processes.map((process, index) => (
                    <tr key={index} className="border-b border-border/50">
                      <td className="p-3">
                        <Input
                          value={process.id}
                          onChange={(e) => handleInputChange(index, "id", e.target.value)}
                          className="max-w-[100px]"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          type="number"
                          value={process.burstTime}
                          onChange={(e) => handleInputChange(index, "burstTime", e.target.value)}
                          className="max-w-[120px]"
                          min="1"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          type="number"
                          value={process.priority}
                          onChange={(e) => handleInputChange(index, "priority", e.target.value)}
                          className="max-w-[120px]"
                          min="1"
                        />
                      </td>
                      <td className="p-3">
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => deleteProcess(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex gap-4">
              <Button 
                onClick={addProcess} 
                className="w-full mt-6 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold text-lg py-6"
              >
                Add Process
              </Button>
              <Button 
                onClick={runScheduling} 
                className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg py-6"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Run Scheduling
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {results && (
          <div className="space-y-6 animate-scale-in">
            {/* Gantt Chart */}
            <Card className="glass-card border-2">
              <CardHeader>
                <CardTitle>Gantt Chart</CardTitle>
                <CardDescription>Process execution timeline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-0 overflow-x-auto">
                    {results.map((process, index) => (
                      <div
                        key={index}
                        className={`${getProcessColor(process.id)} text-white p-4 border-r-2 border-white/30 first:rounded-l-lg last:rounded-r-lg last:border-r-0 min-w-[80px] text-center font-semibold transition-all hover:scale-105`}
                        style={{ 
                          width: `${(process.burstTime / results.reduce((sum, p) => sum + p.burstTime, 0)) * 100}%`,
                          minWidth: '100px'
                        }}
                      >
                        <div className="text-lg">{process.id}</div>
                        <div className="text-sm opacity-90">BT: {process.burstTime}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Timeline markers */}
                  <div className="flex gap-0 text-sm text-muted-foreground">
                    <div className="min-w-[20px]">0</div>
                    {results.map((process, index) => (
                      <div
                        key={index}
                        className="text-right"
                        style={{ 
                          width: `${(process.burstTime / results.reduce((sum, p) => sum + p.burstTime, 0)) * 100}%`,
                          minWidth: '100px'
                        }}
                      >
                        {process.completionTime}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Table */}
            <Card className="glass-card border-2">
              <CardHeader>
                <CardTitle>Scheduling Results</CardTitle>
                <CardDescription>Calculated metrics for each process</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-border">
                        <th className="text-left p-3 font-semibold">Process</th>
                        <th className="text-left p-3 font-semibold">Priority</th>
                        <th className="text-left p-3 font-semibold">Burst Time</th>
                        <th className="text-left p-3 font-semibold">Waiting Time</th>
                        <th className="text-left p-3 font-semibold">Turnaround Time</th>
                        <th className="text-left p-3 font-semibold">Completion Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((process, index) => (
                        <tr key={index} className="border-b border-border/50">
                          <td className="p-3">
                            <span className={`${getProcessColor(process.id)} text-white px-3 py-1 rounded-md font-semibold`}>
                              {process.id}
                            </span>
                          </td>
                          <td className="p-3 font-mono">{process.priority}</td>
                          <td className="p-3 font-mono">{process.burstTime}</td>
                          <td className="p-3 font-mono">{process.waitingTime}</td>
                          <td className="p-3 font-mono">{process.turnaroundTime}</td>
                          <td className="p-3 font-mono">{process.completionTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Averages */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-accent/20 rounded-lg p-4 text-center border-2 border-accent/30">
                    <div className="text-sm text-muted-foreground mb-1">Average Waiting Time</div>
                    <div className="text-3xl font-bold text-accent">{averageWT.toFixed(2)}</div>
                  </div>
                  <div className="bg-secondary/20 rounded-lg p-4 text-center border-2 border-secondary/30">
                    <div className="text-sm text-muted-foreground mb-1">Average Turnaround Time</div>
                    <div className="text-3xl font-bold text-secondary">{averageTAT.toFixed(2)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
