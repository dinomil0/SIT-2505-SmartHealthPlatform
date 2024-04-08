import React from 'react';
import BatteryGauge from 'react-battery-gauge';


const BatteryIcon = ({ percentage }) => {
    return (
        <div>
      <BatteryGauge
        value={percentage}
        aspectRatio={0.28}
        size={70}
        customization={{
          batteryBody: {
            strokeColor: '#333',
            strokeWidth: 1,
            cornerRadius: 2,
          },
          batteryCap: {
            strokeColor: '#333',
            cornerRadius: 1,
            strokeWidth: 1,
            capToBodyRatio: 0.3,
          },
          batteryMeter: {
            outerGap: 1,
            noOfCells: 4,
          },
          readingText: {
            lowBatteryColor: 'red',
            fontSize: 10,
            style: { filter: 'url(#shadow)' },
          },
        }}
      />
    </div>
    );
};

export default BatteryIcon;
