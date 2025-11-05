import { format } from 'date-fns';
import React, { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { IRoles, defaultRoles } from '../store/data/data';
import { useRolesStore } from '../store/store';
import { useGetRolesByIdQuery } from '@/redux/features/roles/rolesSlice';
import { logger } from 'better-auth';

const ViewNextComponents: React.FC = () => {
  const { isViewModalOpen, selectedRoles, toggleViewModal, setSelectedRoles } = useRolesStore();

  const { data: roleData, refetch } = useGetRolesByIdQuery(selectedRoles?._id, { skip: !selectedRoles?._id });

  useEffect(() => {
    if (selectedRoles?._id) {
      refetch();
    }
  }, [selectedRoles?._id, refetch]);

  useEffect(() => {
    if (roleData?.data) {
      setSelectedRoles(roleData.data);
    }
  }, [roleData, setSelectedRoles]);

  const formatDate = (date?: Date | string) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'MMM dd, yyyy');
    } catch (error) {
      logger.error(JSON.stringify(error));
      return 'Invalid Date';
    }
  };

  const DetailRow: React.FC<{
    label: string;
    value: React.ReactNode;
  }> = ({ label, value }) => (
    <div className="grid grid-cols-3 gap-2 py-2 border-b border-white/10">
      <div className="font-semibold text-sm text-white/70">{label}</div>
      <div className="col-span-2 text-sm text-white/90">{value || 'N/A'}</div>
    </div>
  );

  // --- NEW HELPER COMPONENT FOR RENDERING JSON ---
  const DetailRowJson: React.FC<{
    label: string;
    value?: object | unknown[];
  }> = ({ label, value }) => (
    <div className="grid grid-cols-1 gap-1 py-2 border-b border-white/10">
      <div className="font-semibold text-sm text-white/70">{label}</div>
      <div className="col-span-1 text-sm bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-md mt-1">
        <pre className="whitespace-pre-wrap text-xs text-white/80">{value ? JSON.stringify(value, null, 2) : 'N/A'}</pre>
      </div>
    </div>
  );

  return (
    <Dialog open={isViewModalOpen} onOpenChange={toggleViewModal}>
      <DialogContent className="sm:max-w-[625px] bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-lg rounded-2xl">
        <DialogHeader className="border-b border-white/10 pb-3">
          <DialogTitle className="text-lg font-semibold tracking-wide text-white/90">Roles Details</DialogTitle>
        </DialogHeader>
        {selectedRoles && (
          <ScrollArea className="h-[500px] w-full rounded-md border border-white/10 p-4 bg-white/5 backdrop-blur-md shadow-inner">
            <div className="grid gap-1">
              <DetailRow label="name" value={selectedRoles['name']} />
              <DetailRow label="Note" value={selectedRoles['note']} />
              <DetailRow label="Description" value={selectedRoles['description']} />
              <DetailRow label="email" value={selectedRoles['email']} />
              <DetailRowJson label="role" value={selectedRoles['role']} />
              <DetailRow label="Created At" value={formatDate(selectedRoles.createdAt)} />
              <DetailRow label="Updated At" value={formatDate(selectedRoles.updatedAt)} />
            </div>
          </ScrollArea>
        )}
        <DialogFooter className="border-t border-white/10 pt-3">
          <Button
            variant="outlineDefault"
            onClick={() => {
              toggleViewModal(false);
              setSelectedRoles(defaultRoles as IRoles);
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
