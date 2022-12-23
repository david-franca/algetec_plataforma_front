import { handleStringDate } from '../helpers';
import { DemandStatus } from './enum/demandStatus.enum';
import { Experiment } from './experiments.model';
import { Institution } from './institution.model';
import { User } from './user.model';

// eslint-disable-next-line import/no-cycle
type Logger = {
  id: number;
  email: string;
  role_id: number;
  department_id: number;
  name: string;
  remember_me_token: null;
  created_at: string;
  updated_at: string;
};

type DemandLog = {
  id: number;
  demand_id: number;
  logger_id: number;
  type: string;
  progress: number;
  deadline: number;
  started_at: string | null;
  finished_at: string | null;
  created_at: string;
  updated_at: string;
  logger: Logger;
  demandLog_developers: Omit<User, 'role' | 'department'>[];
};

export interface Demand {
  id: number;
  experiment_id: number;
  institution_id: number;
  status: DemandStatus;
  created_at: string;
  updated_at: string;
  scripting: number;
  modeling: number;
  coding: number;
  testing: number;
  ualab: number;
  experiments: Experiment;
  institutions: Omit<Institution, 'demands'>;
  demandLogs: DemandLog[];
}

export type DemandCreate = Pick<Demand, 'status' | 'experiment_id' | 'institution_id'> & {
  logger_id: number;
  scripting_deadline: number;
  coding_deadline: number;
  testing_deadline: number;
  modeling_deadline: number;
  ualab_deadline: number;
  scripting_developers: number[];
  coding_developers: number[];
  testing_developers: number[];
  modeling_developers: number[];
  ualab_developers: number[];
  scripting_startedAt: string;
  scripting_finishedAt: string;
  modeling_startedAt: string;
  modeling_finishedAt: string;
  coding_startedAt: string;
  coding_finishedAt: string;
  testing_startedAt: string;
  testing_finishedAt: string;
  ualab_startedAt: string;
  ualab_finishedAt: string;
};

export type DemandUpdate = Pick<Demand, 'id' | 'status' | 'experiment_id' | 'institution_id'> & {
  logger_id: number;
  scripting_developers: number[];
  coding_developers: number[];
  testing_developers: number[];
  modeling_developers: number[];
  ualab_developers: number[];
  scripting: number;
  coding: number;
  testing: number;
  modeling: number;
  ualab: number;
  scripting_finishedAt: string;
  modeling_finishedAt: string;
  coding_finishedAt: string;
  testing_finishedAt: string;
  ualab_finishedAt: string;
};

type DemandProduction = {
  experimentName: string;
  status: DemandStatus;
  production: Array<{
    type: string;
    responsible: string;
    started_at: string | null | undefined;
    finished_at: string | null | undefined;
    deadline: number;
    progress: number;
  }>;
};

interface SelectOption {
  value: number;
  label: string;
}

// type DemandUpdateForm = {
//   id: number;
//   coding_developers: SelectOption[];
//   modeling_developers: SelectOption[];
//   testing_developers: SelectOption[];
//   scripting_developers: SelectOption[];
//   ualab_developers: SelectOption[];
//   logger_id: number;
//   scripting_deadline: number;
//   coding_deadline: number;
//   testing_deadline: number;
//   modeling_deadline: number;
//   ualab_deadline: number;
//   scripting_finishedAt: string | null;
//   modeling_finishedAt: string | null;
//   coding_finishedAt: string | null;
//   testing_finishedAt: string | null;
//   ualab_finishedAt: string | null;
//   status: DemandStatus;
//   experiment_id: number;
//   institution_id: number;
// };

interface DemandUpdateForm {
  id: number;
  institution_id: number;
  experiment_id: number;
  status: DemandStatus;
  logger_id: number;
  coding_developers: SelectOption[];
  modeling_developers: SelectOption[];
  testing_developers: SelectOption[];
  scripting_developers: SelectOption[];
  ualab_developers: SelectOption[];
  scripting: number;
  coding: number;
  testing: number;
  modeling: number;
  ualab: number;
  scripting_finishedAt: Date;
  modeling_finishedAt: Date;
  coding_finishedAt: Date;
  testing_finishedAt: Date;
  ualab_finishedAt: Date;
}

export class IDemand {
  // eslint-disable-next-line no-useless-constructor
  constructor(private demand: Demand) {}

  get id(): number {
    return this.demand.id;
  }

  get experimentName(): string {
    return this.demand.experiments.name;
  }

  get status(): DemandStatus {
    return this.demand.status;
  }

  get scripting(): number {
    return this.demand.scripting;
  }

  get modeling(): number {
    return this.demand.modeling;
  }

  get coding(): number {
    return this.demand.coding;
  }

  get testing(): number {
    return this.demand.testing;
  }

  get ualab(): number {
    return this.demand.ualab;
  }

  get mostRecentScriptingLog() {
    return this.demand.demandLogs
      .filter((demandLog) => demandLog.type === 'Scripting')
      .sort((a, b) => (a.id > b.id ? 1 : -1))[0];
  }

  get mostRecentCodingLog() {
    return this.demand.demandLogs
      .filter((demandLog) => demandLog.type === 'Coding')
      .sort((a, b) => (a.id > b.id ? 1 : -1))[0];
  }

  get mostRecentTestingLog() {
    return this.demand.demandLogs
      .filter((demandLog) => demandLog.type === 'Testing')
      .sort((a, b) => (a.id > b.id ? 1 : -1))[0];
  }

  get mostRecentModelingLog() {
    return this.demand.demandLogs
      .filter((demandLog) => demandLog.type === 'Modeling')
      .sort((a, b) => (a.id > b.id ? 1 : -1))[0];
  }

  get mostRecentUalabLog() {
    return this.demand.demandLogs
      .filter((demandLog) => demandLog.type === 'Ualab')
      .sort((a, b) => (a.id > b.id ? 1 : -1))[0];
  }

  toProduction(): DemandProduction {
    return {
      experimentName: this.experimentName,
      status: this.status,
      production: [
        {
          type: 'Roteirização',
          responsible: this.mostRecentScriptingLog.demandLog_developers.map((developer) => developer.name).join(', '),
          started_at: handleStringDate(this.mostRecentScriptingLog.started_at) || '',
          finished_at: handleStringDate(this.mostRecentScriptingLog.finished_at) || '',
          progress: this.scripting,
          deadline: this.mostRecentScriptingLog.deadline,
        },
        {
          type: 'Programação',
          responsible: this.mostRecentCodingLog.demandLog_developers.map((developer) => developer.name).join(', '),
          started_at: handleStringDate(this.mostRecentCodingLog.started_at) || '',
          finished_at: handleStringDate(this.mostRecentCodingLog.finished_at) || '',
          progress: this.coding,
          deadline: this.mostRecentCodingLog.deadline,
        },
        {
          type: 'Testes',
          responsible: this.mostRecentTestingLog.demandLog_developers.map((developer) => developer.name).join(', '),
          started_at: handleStringDate(this.mostRecentTestingLog.started_at) || '',
          finished_at: handleStringDate(this.mostRecentTestingLog.finished_at) || '',
          progress: this.testing,
          deadline: this.mostRecentTestingLog.deadline,
        },
        {
          type: 'Modelagem',
          responsible: this.mostRecentModelingLog.demandLog_developers.map((developer) => developer.name).join(', '),
          started_at: handleStringDate(this.mostRecentModelingLog.started_at) || '',
          finished_at: handleStringDate(this.mostRecentModelingLog.finished_at) || '',
          progress: this.modeling,
          deadline: this.mostRecentModelingLog.deadline,
        },
        {
          type: 'UALAB',
          responsible: this.mostRecentUalabLog.demandLog_developers.map((developer) => developer.name).join(', '),
          started_at: handleStringDate(this.mostRecentUalabLog.started_at),
          finished_at: handleStringDate(this.mostRecentUalabLog.finished_at),
          progress: this.ualab,
          deadline: this.mostRecentUalabLog.deadline,
        },
      ],
    };
  }

  toUpdate(): DemandUpdateForm {
    return {
      id: this.id,
      status: this.status,
      experiment_id: this.demand.experiments.id,
      institution_id: this.demand.institutions.id,
      logger_id: 0,
      scripting_developers: this.mostRecentScriptingLog.demandLog_developers.map((developer) => ({
        value: developer.id,
        label: developer.name,
      })),
      coding_developers: this.mostRecentCodingLog.demandLog_developers.map((developer) => ({
        value: developer.id,
        label: developer.name,
      })),
      testing_developers: this.mostRecentTestingLog.demandLog_developers.map((developer) => ({
        value: developer.id,
        label: developer.name,
      })),
      modeling_developers: this.mostRecentModelingLog.demandLog_developers.map((developer) => ({
        value: developer.id,
        label: developer.name,
      })),
      ualab_developers: this.mostRecentUalabLog.demandLog_developers.map((developer) => ({
        value: developer.id,
        label: developer.name,
      })),
      scripting: this.scripting,
      coding: this.coding,
      testing: this.testing,
      modeling: this.modeling,
      ualab: this.ualab,
      ualab_finishedAt: new Date(this.mostRecentUalabLog.finished_at || ''),
      coding_finishedAt: new Date(this.mostRecentCodingLog.finished_at || ''),
      scripting_finishedAt: new Date(this.mostRecentScriptingLog.finished_at || ''),
      testing_finishedAt: new Date(this.mostRecentTestingLog.finished_at || ''),
      modeling_finishedAt: new Date(this.mostRecentModelingLog.finished_at || ''),
    };
  }

  toDemand(): Demand {
    return this.demand;
  }
}
