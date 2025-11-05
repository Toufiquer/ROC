'use client';

import Image from 'next/image';
import React, { useEffect } from 'react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StringArrayData } from './others-field-type/types';
import { logger } from 'better-auth';
import { formatDuplicateKeyError, isApiErrorResponse } from '@/components/common/utils';

import { ISessions, defaultSessions } from '../store/data/data';
import { useSessionsStore } from '../store/store';
import { useGetSessionsByIdQuery } from '@/redux/features/sessions/sessionsSlice';

type Primitive = string | number | boolean | null | undefined;
type Arrayish = Array<string | number | boolean>;
type JSONLike =
  | string
  | number
  | boolean
  | null
  | undefined
  | Record<string, unknown>
  | StringArrayData[];

const ViewNextComponents: React.FC = () => {
  const { selectedSessions, isViewModalOpen, toggleViewModal, setSelectedSessions } = useSessionsStore();

  const { data: sessionData, refetch } = useGetSessionsByIdQuery(
    selectedSessions?._id,
    { skip: !selectedSessions?._id }
  );

  useEffect(() => {
    if (selectedSessions?._id) refetch();
  }, [selectedSessions?._id, refetch]);

  useEffect(() => {
    if (sessionData?.data) setSelectedSessions(sessionData.data as ISessions);
  }, [sessionData, setSelectedSessions]);

  const formatDate = (d?: string | Date): string => {
    if (!d) return 'N/A';
    try {
      return format(new Date(d), 'MMM dd, yyyy');
    } catch (error: unknown) {
      let errMessage: string = 'Invalid Date';
      if (isApiErrorResponse(error)) {
        errMessage = formatDuplicateKeyError(error.data.message) || 'API error';
      } else if (error instanceof Error) {
        errMessage = error.message;
      }
      logger.error(JSON.stringify(errMessage));
      return 'Invalid';
    }
  };

  const formatBoolean = (v?: boolean): string => (v ? 'Yes' : 'No');

  const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/10">
      <span className="text-sm text-white/80">{label}</span>
      <span className="col-span-2 text-sm text-white">{(value ?? 'N/A') as Primitive}</span>
    </div>
  );

  const DetailRowArray: React.FC<{ label: string; values?: Arrayish | null }> = ({ label, values }) => (
    <DetailRow label={label} value={values?.join(', ') || 'N/A'} />
  );

  const DetailRowJson: React.FC<{ label: string; value?: JSONLike }> = ({ label, value }) => (
    <div className="py-2 border-b border-white/10">
      <div className="text-sm text-white/80">{label}</div>
      <pre className="text-[11px] text-white/90 bg-white/5 rounded-md p-2 mt-1 overflow-auto">{value ? JSON.stringify(value, null, 2) : 'N/A'}</pre>
    </div>
  );

  return (
    <Dialog open={isViewModalOpen} onOpenChange={toggleViewModal}>
      <DialogContent className="sm:max-w-2xl mt-8 rounded-xl bg-white/10 backdrop-blur-2xl border border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="bg-clip-text text-transparent bg-linear-to-r from-white to-blue-200">
            Sessions Details
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[520px] rounded-lg border border-white/10 bg-white/5 backdrop-blur-xl p-4 mt-3">
          {selectedSessions && (
            <>
              <DetailRow label="ExpiresAt" value={formatDate(selectedSessions['expiresAt'])} />
              <DetailRow label="Token" value={selectedSessions['token']} />
              <DetailRow label="CreatedAt" value={formatDate(selectedSessions['createdAt'])} />
              <DetailRow label="UpdatedAt" value={formatDate(selectedSessions['updatedAt'])} />
              <DetailRow label="IpAddress" value={selectedSessions['ipAddress']} />
              <DetailRow label="UserAgent" value={selectedSessions['userAgent']} />
              <DetailRow label="UserId" value={selectedSessions['userId']} />
              <DetailRow label="Created At" value={formatDate(selectedSessions.createdAt)} />
              <DetailRow label="Updated At" value={formatDate(selectedSessions.updatedAt)} />
              






            </>
          )}
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button
            variant="outlineWater"
            onClick={() => {
              toggleViewModal(false);
              setSelectedSessions(defaultSessions as ISessions);
            }}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewNextComponents;
