'use client'
import { Player } from "@/types";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";



// Player Card Component
interface PlayerCardProps {
  player: Player;
  leagueBadge?: string
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
//   const badgeColor = leagueBadgeColors[player.leagueBadge] || "bg-gray-500";
  
  return (
    <Card className="rounded-lg shadow-sm cursor-pointer overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img 
          src={player.image} 
          alt={player.name} 
          className="w-full h-48 object-contain object-center"
        />
        <Badge variant={"outline"} className={`absolute top-2 right-2  font-bold py-1 px-2 rounded-full text-xs`}>
          {player.leagueBadge}
        </Badge>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-jersey15 ">{player.name}</h3>
            <p className="text-sm text-gray-600">{player.position} • {player.team}</p>
          </div>
        </div>
        
        <Badge variant={"outline"} className="grid grid-cols-3 py-2 gap-2 mt-4">
          <div  className="text-center  rounded-md">
            <p className="text-xs text-gray-500">Goals</p>
            <p className="text-lg font-bold ">{player.goals}</p>
          </div>
          <div className="text-center  rounded-md">
            <p className="text-xs text-gray-500">Assists</p>
            <p className="text-lg font-bold ">{player.assists}</p>
          </div>
          <div className="text-center  rounded-md">
            <p className="text-xs text-gray-500">Apps</p>
            <p className="text-lg font-bold ">{player.appearances}</p>
          </div>
        </Badge>
      </div>
    </Card>
  );
};


export default PlayerCard