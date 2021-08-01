const os = require('os');

const cpuAverage = () => {
  // 매 호출때마다 새로 cpu정보를 업데이트해오기위해 새로 cpus를 선언
  const cpus = os.cpus();
  let idleMs = 0;
  let totalMs = 0;

  cpus.forEach((core) => {
    for (key in core.times) {
      totalMs += core.times[key];
    }
    idleMs += core.times.idle;
  });

  return {
    idle: idleMs / cpus.length,
    total: totalMs / cpus.length,
  };
};

const getCpuLoad = () => {
  return new Promise((resolve, reject) => {
    const start = cpuAverage();
    setTimeout(() => {
      const end = cpuAverage();
      const idleDiff = end.idle - start.idle;
      const totalDiff = end.total - start.total;
      const percentageCpu = 100 - Math.floor((100 * idleDiff) / totalDiff);

      resolve(percentageCpu);
    }, 100);
  });
};

const performanceData = async () => {
  const osType = os.type() === 'Darwin' ? 'Mac' : os.type();
  const uptime = os.uptime();
  const freeMemory = os.freemem();
  const totalMemory = os.totalmem();
  const usedMemory = Math.floor((freeMemory / totalMemory) * 100) / 100;
  const cpus = os.cpus();
  const cpuModel = cpus[0].model;
  const cpuSpeed = cpus[0].speed;
  const cpuLoad = await getCpuLoad();
  const numOfCores = cpus.length;
  const loadAverage = os.loadavg();

  return {
    osType: osType,
    uptime: uptime,
    freeMemory: freeMemory,
    totalMemory: totalMemory,
    usedMemory: usedMemory,
    cpuModel: cpuModel,
    cpuSpeed: cpuSpeed,
    numOfCores: numOfCores,
    loadAverage: loadAverage,
    cpuLoad: cpuLoad,
  };
};

performanceData().then((data) => console.log(data));
