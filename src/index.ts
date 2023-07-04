import server from './server/server'
import * as dotenv from 'dotenv'
import { availableParallelism } from 'os'
import { IdbItem } from './db/types';
import { updateDb } from './db-api/api';
import * as c from 'cluster';
import { balancesIterator } from './balancer/balancer';

const cluster = c as unknown as c.Cluster;
dotenv.config()
if(cluster.isPrimary && process.argv[2] === 'multi') {
  cluster.setupPrimary({
    silent: true
  });
  console.log('Starting multithreaded api')
  const cpus = availableParallelism() > 8 ? 8 : availableParallelism();
  const masterPort = Number(process.env.PORT) || 3000;
  const workersArr: { worker: c.Worker, port: number }[] = [];
  let sharedDb: IdbItem[] = [];
  for(let i = 1; i < cpus; i++) {
    const worker = cluster.fork({ PORT: masterPort + i });
    worker.process.stdout.pipe(process.stdout);
    workersArr.push({ worker, port: masterPort + i });
    worker.on('message', (message: string) => {
      sharedDb = JSON.parse(message) as IdbItem[];
      console.log('Got new db from worker', sharedDb)
      workersArr.forEach(workerItem => workerItem.worker.send(sharedDb))
    })
  }
  const balancer = balancesIterator(workersArr);
  balancer.listen(
    masterPort,
    () => console.log(`Started API using ${cpus} threads on http:/localhost:${masterPort}/api/users\nWaiting for workers to start...`))
} else if(cluster.isWorker) {
  const port = Number(process.env.PORT)
  server.listen(port, () => {
    console.log(`Started worker on port ${port}`)
  })
  process.on('message', updateDb)
} else {
  const port = Number(process.env.PORT)
  server.listen(port, () => {
    console.log(`Running on port ${port}`)
  })
}


