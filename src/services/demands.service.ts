import { api } from '../config/reducers/apiSlice';
import { Demand, DemandCreate, DemandUpdate } from '../models/demands.model';
import { Experiment } from '../models/experiments.model';

export const demandsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getDemands: build.query<Demand[], void>({
      query: () => 'demands/all',
      providesTags: ['Demands'],
    }),
    getDemandById: build.query<Demand, number>({
      query: (id) => `demands/show/${id}`,
      providesTags: ['Demands'],
    }),
    storeDemand: build.mutation<Demand, DemandCreate>({
      query: (body) => ({
        url: 'demands/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Demands'],
    }),
    updateDemand: build.mutation<Demand, DemandUpdate>({
      query: (body) => ({
        url: `demands/update/${body.id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Demands'],
    }),
    destroyDemand: build.mutation<void, number>({
      query: (id) => ({
        url: `demands/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Demands'],
    }),
    getExperiments: build.query<Experiment[], void>({
      query: () => 'demands/experiments',
      providesTags: ['Experiments'],
    }),
  }),
});

export const {
  useGetDemandsQuery,
  useStoreDemandMutation,
  useUpdateDemandMutation,
  useDestroyDemandMutation,
  useGetExperimentsQuery,
  useGetDemandByIdQuery,
} = demandsApi;
