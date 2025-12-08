"use client";
import Chart from '../components/chart'
import ActionPlan from '../components/actionPlan'
export default function Dashboard() {
  return (

    
    <div className='flex'>
      <div>
        <ActionPlan/>
      </div>
      <div>
        <Chart />
      </div>

      {/* right section */}
      <div className='bg-amber-500 h-[45vh] w-[50vw]'>
          {/* Map */}
          <div>Map</div>
      </div>
    </div>
  );
}