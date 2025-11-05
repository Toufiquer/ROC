/*
|-----------------------------------------
| Site Menu Editor with Advanced Drag & Drop
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: App Generator, November, 2025
|-----------------------------------------
*/
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  DragOverEvent,
  pointerWithin,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ShieldCheck,
  FolderKanban,
  FileSignature,
  User,
  Users,
  FileText,
  Settings,
  Info,
  Wrench,
  Phone,
  HelpCircle,
  Menu,
  Lock,
  ScrollText,
  FileBadge,
  Eye,
  Edit2,
  Trash2,
  Plus,
  GripVertical,
  Save,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarItem {
  sl_no: number;
  name: string;
  path: string;
  icon: React.ReactNode;
  iconName?: string;
  children?: SidebarItem[];
}

interface DragState {
  activeId: string | null;
  overId: string | null;
  activeItem: SidebarItem | null;
  originalParentId: number | null;
  originalIndex: number;
}

const iconMap: Record<string, React.ReactNode> = {
  ShieldCheck: <ShieldCheck size={18} />,
  FolderKanban: <FolderKanban size={16} />,
  FileSignature: <FileSignature size={16} />,
  User: <User size={16} />,
  Users: <Users size={16} />,
  FileText: <FileText size={16} />,
  Settings: <Settings size={18} />,
  Info: <Info size={16} />,
  Wrench: <Wrench size={16} />,
  Phone: <Phone size={16} />,
  HelpCircle: <HelpCircle size={16} />,
  Menu: <Menu size={16} />,
  Lock: <Lock size={16} />,
  ScrollText: <ScrollText size={16} />,
  FileBadge: <FileBadge size={16} />,
};

const iconOptions = Object.keys(iconMap);

const initialData: SidebarItem[] = [
  {
    sl_no: 1,
    name: 'Access',
    path: '/dashboard/access',
    icon: <ShieldCheck size={18} />,
    iconName: 'ShieldCheck',
    children: [
      {
        sl_no: 11,
        name: 'Access',
        path: '/dashboard/access/access',
        icon: <FolderKanban size={16} />,
        iconName: 'FolderKanban',
      },
      {
        sl_no: 12,
        name: 'Role',
        path: '/dashboard/access/role',
        icon: <FileSignature size={16} />,
        iconName: 'FileSignature',
      },
      {
        sl_no: 13,
        name: 'Sidebar',
        path: '/dashboard/access/sidebar',
        icon: <FileSignature size={16} />,
        iconName: 'FileSignature',
      },
      {
        sl_no: 14,
        name: 'Account',
        path: '/dashboard/access/account',
        icon: <User size={16} />,
        iconName: 'User',
      },
      {
        sl_no: 15,
        name: 'Users',
        path: '/dashboard/access/user',
        icon: <Users size={16} />,
        iconName: 'Users',
      },
      {
        sl_no: 16,
        name: 'Session',
        path: '/dashboard/access/session',
        icon: <FileText size={16} />,
        iconName: 'FileText',
      },
      {
        sl_no: 17,
        name: 'Verification',
        path: '/dashboard/access/verification',
        icon: <ShieldCheck size={16} />,
        iconName: 'ShieldCheck',
      },
    ],
  },
  {
    sl_no: 2,
    name: 'Site Settings',
    path: '/dashboard/site-setting',
    icon: <Settings size={18} />,
    iconName: 'Settings',
    children: [
      {
        sl_no: 21,
        name: 'About',
        path: '/dashboard/site-setting/about',
        icon: <Info size={16} />,
        iconName: 'Info',
      },
      {
        sl_no: 22,
        name: 'Services',
        path: '/dashboard/site-setting/service',
        icon: <Wrench size={16} />,
        iconName: 'Wrench',
      },
      {
        sl_no: 23,
        name: 'Contact',
        path: '/dashboard/site-setting/contact',
        icon: <Phone size={16} />,
        iconName: 'Phone',
      },
      {
        sl_no: 24,
        name: 'FAQ',
        path: '/dashboard/site-setting/faq',
        icon: <HelpCircle size={16} />,
        iconName: 'HelpCircle',
      },
      {
        sl_no: 25,
        name: 'Menu',
        path: '/dashboard/site-setting/menu',
        icon: <Menu size={16} />,
        iconName: 'Menu',
      },
      {
        sl_no: 26,
        name: 'Privacy Policy',
        path: '/dashboard/site-setting/privacy-policy',
        icon: <Lock size={16} />,
        iconName: 'Lock',
      },
      {
        sl_no: 27,
        name: 'Terms & Conditions',
        path: '/dashboard/site-setting/terms-conditions',
        icon: <ScrollText size={16} />,
        iconName: 'ScrollText',
      },
      {
        sl_no: 28,
        name: 'Footer',
        path: '/dashboard/site-setting/footer',
        icon: <FileBadge size={16} />,
        iconName: 'FileBadge',
      },
    ],
  },
];

interface SortableItemProps {
  item: SidebarItem;
  onView: (item: SidebarItem) => void;
  onEdit: (item: SidebarItem) => void;
  onDelete: (item: SidebarItem) => void;
  onAddChild?: (parentItem: SidebarItem) => void;
  onToggleCollapse?: (itemId: number) => void;
  isCollapsed?: boolean;
  isChild?: boolean;
  isOverTarget?: boolean;
  isDragging?: boolean;
  dropPosition?: 'before' | 'after' | 'inside' | null;
}

function SortableItem({
  item,
  onView,
  onEdit,
  onDelete,
  onAddChild,
  onToggleCollapse,
  isCollapsed = false,
  isChild = false,
  isOverTarget = false,
  isDragging = false,
  dropPosition = null,
}: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.sl_no.toString(),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  const hasChildren = item.children && item.children.length > 0;

  const getBorderClass = () => {
    if (!isOverTarget) return 'border border-white/20';
    if (dropPosition === 'inside') return 'border-2 border-purple-400 ring-2 ring-purple-400/50';
    if (dropPosition === 'before') return 'border-t-4 border-t-blue-400 border-x border-b border-white/20';
    if (dropPosition === 'after') return 'border-b-4 border-b-blue-400 border-x border-t border-white/20';
    return 'border-2 border-blue-400 ring-2 ring-blue-400/50';
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className={`group relative backdrop-blur-xl bg-white/10 rounded-lg p-2 shadow-lg hover:shadow-2xl hover:bg-white/20 transition-all duration-300 ${
        isChild ? 'ml-6' : ''
      } ${getBorderClass()}`}
    >
      <div className="flex items-center gap-2">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 hover:bg-white/20 rounded transition-colors">
          <GripVertical size={18} className="text-gray-300" />
        </div>

        {!isChild && hasChildren && (
          <Button onClick={() => onToggleCollapse?.(item.sl_no)} variant="outlineGlassy" className="w-1 min-w-1" size="xs">
            {isCollapsed ? <ChevronRight size={16} className="text-gray-300" /> : <ChevronDown size={16} className="text-gray-300" />}
          </Button>
        )}

        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="p-1.5 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">{item.icon}</div>
          <span className="font-medium text-sm text-white truncate">{item.name}</span>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button onClick={() => onView(item)} variant="outlineGlassy" className="min-w-1" size="xs">
            <Eye size={14} />
          </Button>
          <Button onClick={() => onEdit(item)} variant="outlineGlassy" className="min-w-1" size="xs">
            <Edit2 size={14} />
          </Button>
          <Button onClick={() => onDelete(item)} variant="outlineGlassy" className="min-w-1" size="xs">
            <Trash2 size={14} />
          </Button>
          {!isChild && onAddChild && (
            <Button onClick={() => onAddChild(item)} variant="outlineGlassy" className="min-w-1" size="xs">
              Add +
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function DropZone({ id, label, isOver }: { id: string; label: string; isOver: boolean }) {
  const { setNodeRef } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`h-12 rounded-lg border-2 border-dashed transition-all duration-200 flex items-center justify-center ${
        isOver ? 'border-green-400 bg-green-400/20 scale-105' : 'border-white/20 bg-white/5'
      }`}
    >
      <span className={`text-sm font-medium transition-colors ${isOver ? 'text-green-300' : 'text-gray-400'}`}>{label}</span>
    </div>
  );
}

export default function SiteMenuPage() {
  const [menuItems, setMenuItems] = useState<SidebarItem[]>(initialData);
  const [viewItem, setViewItem] = useState<SidebarItem | null>(null);
  const [editItem, setEditItem] = useState<SidebarItem | null>(null);
  const [addParentItem, setAddParentItem] = useState<SidebarItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<SidebarItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({ name: '', path: '', iconName: 'Menu' });
  const [collapsedItems, setCollapsedItems] = useState<Set<number>>(new Set());

  const [dragState, setDragState] = useState<DragState>({
    activeId: null,
    overId: null,
    activeItem: null,
    originalParentId: null,
    originalIndex: -1,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const updateSlNo = (items: SidebarItem[]): SidebarItem[] => {
    return items.map((item, index) => {
      const newSlNo = (index + 1) * 10;
      return {
        ...item,
        sl_no: newSlNo,
        children: item.children?.map((child, childIndex) => ({
          ...child,
          sl_no: newSlNo + childIndex + 1,
        })),
      };
    });
  };

  const findItemById = (id: string, items: SidebarItem[] = menuItems): { item: SidebarItem; parentId: number | null; index: number } | null => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.sl_no.toString() === id) {
        return { item, parentId: null, index: i };
      }
      if (item.children) {
        for (let j = 0; j < item.children.length; j++) {
          if (item.children[j].sl_no.toString() === id) {
            return { item: item.children[j], parentId: item.sl_no, index: j };
          }
        }
      }
    }
    return null;
  };

  const getAllSortableIds = (): string[] => {
    const ids: string[] = ['drop-zone-top'];
    menuItems.forEach(item => {
      ids.push(item.sl_no.toString());
      if (item.children) {
        item.children.forEach(child => ids.push(child.sl_no.toString()));
      }
    });
    return ids;
  };

  const getDropPosition = (overId: string, activeId: string): 'before' | 'after' | 'inside' | null => {
    if (!overId || overId === activeId) return null;

    const overItem = findItemById(overId);
    const activeItem = findItemById(activeId);

    if (!overItem || !activeItem) return null;

    if (overItem.parentId === null && activeItem.parentId !== null) {
      return 'inside';
    }

    if (overItem.parentId === activeItem.parentId) {
      return overItem.index > activeItem.index ? 'after' : 'before';
    }

    return 'inside';
  };

  const handleDragStart = (event: DragStartEvent) => {
    const activeId = event.active.id.toString();
    const result = findItemById(activeId);

    if (result) {
      setDragState({
        activeId,
        overId: null,
        activeItem: result.item,
        originalParentId: result.parentId,
        originalIndex: result.index,
      });
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const overId = event.over?.id?.toString() || null;
    setDragState(prev => ({ ...prev, overId }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setDragState({
        activeId: null,
        overId: null,
        activeItem: null,
        originalParentId: null,
        originalIndex: -1,
      });
      return;
    }

    const activeId = active.id.toString();
    const overId = over.id.toString();

    if (activeId === overId) {
      setDragState({
        activeId: null,
        overId: null,
        activeItem: null,
        originalParentId: null,
        originalIndex: -1,
      });
      return;
    }

    const activeResult = findItemById(activeId);
    const overResult = overId === 'drop-zone-top' ? null : findItemById(overId);

    if (!activeResult) {
      setDragState({
        activeId: null,
        overId: null,
        activeItem: null,
        originalParentId: null,
        originalIndex: -1,
      });
      return;
    }

    setMenuItems(items => {
      let newItems = [...items];

      if (overId === 'drop-zone-top') {
        newItems = newItems.map(item => ({
          ...item,
          children: item.children?.filter(c => c.sl_no !== activeResult.item.sl_no),
        }));

        const itemToMove = { ...activeResult.item, children: [] };
        newItems = [itemToMove, ...newItems];
        toast.success(`"${activeResult.item.name}" moved to top level!`);
        return updateSlNo(newItems);
      }

      if (!overResult) return items;

      if (overResult.parentId === null) {
        newItems = newItems.map(item => ({
          ...item,
          children: item.children?.filter(c => c.sl_no !== activeResult.item.sl_no),
        }));

        newItems = newItems.filter(item => item.sl_no !== activeResult.item.sl_no);

        const targetParent = newItems.find(item => item.sl_no === overResult.item.sl_no);
        if (targetParent) {
          const childToAdd = { ...activeResult.item };
          delete childToAdd.children;
          targetParent.children = [...(targetParent.children || []), childToAdd];
          toast.success(`"${activeResult.item.name}" moved to "${targetParent.name}" submenu!`);
        }

        return updateSlNo(newItems);
      }

      if (activeResult.parentId === overResult.parentId) {
        const parent = newItems.find(item => item.sl_no === activeResult.parentId);
        if (parent?.children) {
          const oldIndex = parent.children.findIndex(c => c.sl_no === activeResult.item.sl_no);
          const newIndex = parent.children.findIndex(c => c.sl_no === overResult.item.sl_no);
          parent.children = arrayMove(parent.children, oldIndex, newIndex);
          toast.success('Submenu reordered!');
        }
        return updateSlNo(newItems);
      }

      newItems = newItems.map(item => {
        if (item.sl_no === activeResult.parentId) {
          return {
            ...item,
            children: item.children?.filter(c => c.sl_no !== activeResult.item.sl_no),
          };
        }
        if (item.sl_no === overResult.parentId) {
          const childToAdd = { ...activeResult.item };
          delete childToAdd.children;
          return {
            ...item,
            children: [...(item.children || []), childToAdd],
          };
        }
        return item;
      });

      toast.success(`"${activeResult.item.name}" moved successfully!`);
      return updateSlNo(newItems);
    });

    setDragState({
      activeId: null,
      overId: null,
      activeItem: null,
      originalParentId: null,
      originalIndex: -1,
    });
  };

  const handleDragCancel = () => {
    setDragState({
      activeId: null,
      overId: null,
      activeItem: null,
      originalParentId: null,
      originalIndex: -1,
    });
  };

  const handleToggleCollapse = (itemId: number) => {
    setCollapsedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleDelete = (item: SidebarItem) => {
    setDeleteItem(item);
  };

  const confirmDelete = () => {
    if (!deleteItem) return;

    setMenuItems(items => {
      const newItems = items
        .filter(i => i.sl_no !== deleteItem.sl_no)
        .map(i => ({
          ...i,
          children: i.children?.filter(c => c.sl_no !== deleteItem.sl_no),
        }));
      return updateSlNo(newItems);
    });

    toast.success(`"${deleteItem.name}" deleted successfully!`);
    setDeleteItem(null);
  };

  const handleEditSave = () => {
    if (!editItem) return;

    const updatedIcon = iconMap[formData.iconName] || iconMap.Menu;

    setMenuItems(items =>
      items.map(item => {
        if (item.sl_no === editItem.sl_no) {
          return {
            ...item,
            name: formData.name,
            path: formData.path,
            icon: updatedIcon,
            iconName: formData.iconName,
          };
        }
        if (item.children) {
          return {
            ...item,
            children: item.children.map(child =>
              child.sl_no === editItem.sl_no
                ? {
                    ...child,
                    name: formData.name,
                    path: formData.path,
                    icon: updatedIcon,
                    iconName: formData.iconName,
                  }
                : child,
            ),
          };
        }
        return item;
      }),
    );

    toast.success(`"${formData.name}" updated successfully!`);
    setEditItem(null);
    setFormData({ name: '', path: '', iconName: 'Menu' });
  };

  const handleAddNew = () => {
    if (!formData.name || !formData.path) {
      toast.error('Please fill in all fields');
      return;
    }

    const newIcon = iconMap[formData.iconName] || iconMap.Menu;
    const newSlNo = (menuItems.length + 1) * 10;

    const newItem: SidebarItem = {
      sl_no: newSlNo,
      name: formData.name,
      path: formData.path,
      icon: newIcon,
      iconName: formData.iconName,
      children: [],
    };

    setMenuItems(items => updateSlNo([...items, newItem]));
    toast.success(`"${formData.name}" added successfully!`);
    setIsAddingNew(false);
    setFormData({ name: '', path: '', iconName: 'Menu' });
  };

  const handleAddChild = () => {
    if (!addParentItem || !formData.name || !formData.path) {
      toast.error('Please fill in all fields');
      return;
    }

    const newIcon = iconMap[formData.iconName] || iconMap.Menu;

    setMenuItems(items =>
      updateSlNo(
        items.map(item => {
          if (item.sl_no === addParentItem.sl_no) {
            const children = item.children || [];
            const newChild: SidebarItem = {
              sl_no: item.sl_no * 10 + children.length + 1,
              name: formData.name,
              path: formData.path,
              icon: newIcon,
              iconName: formData.iconName,
            };
            return { ...item, children: [...children, newChild] };
          }
          return item;
        }),
      ),
    );

    toast.success(`"${formData.name}" added as submenu!`);
    setAddParentItem(null);
    setFormData({ name: '', path: '', iconName: 'Menu' });
  };

  const handleSubmit = () => {
    console.log('Menu Data:', JSON.stringify(menuItems, null, 2));
    toast.success('Menu data logged to console!');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-2 sm:p-4 md:p-6">
      <div className="mt-[65px]" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-3 sm:p-4 mb-4 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Site Menu Editor</h1>
              <p className="text-sm text-gray-300">Drag submenu items anywhere: reorder, move between parents, or promote to top-level</p>
            </div>
            <Button onClick={() => setIsAddingNew(true)} variant="outlineGlassy" size="sm">
              <Plus size={18} className="mr-2" />
              Add New Menu
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <DndContext
            sensors={sensors}
            collisionDetection={pointerWithin}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <SortableContext items={getAllSortableIds()} strategy={verticalListSortingStrategy}>
              <DropZone id="drop-zone-top" label="Drop here to create top-level menu" isOver={dragState.overId === 'drop-zone-top'} />

              <AnimatePresence mode="popLayout">
                {menuItems.map(item => (
                  <div key={item.sl_no} className="space-y-2">
                    <SortableItem
                      item={item}
                      onView={setViewItem}
                      onEdit={i => {
                        setEditItem(i);
                        setFormData({ name: i.name, path: i.path, iconName: i.iconName || 'Menu' });
                      }}
                      onDelete={handleDelete}
                      onAddChild={setAddParentItem}
                      onToggleCollapse={handleToggleCollapse}
                      isCollapsed={collapsedItems.has(item.sl_no)}
                      isOverTarget={dragState.overId === item.sl_no.toString()}
                      isDragging={dragState.activeId === item.sl_no.toString()}
                      dropPosition={getDropPosition(dragState.overId || '', dragState.activeId || '')}
                    />

                    {item.children && item.children.length > 0 && !collapsedItems.has(item.sl_no) && (
                      <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.children.map(child => (
                          <SortableItem
                            key={child.sl_no}
                            item={child}
                            onView={setViewItem}
                            onEdit={i => {
                              setEditItem(i);
                              setFormData({ name: i.name, path: i.path, iconName: i.iconName || 'Menu' });
                            }}
                            onDelete={handleDelete}
                            isChild
                            isOverTarget={dragState.overId === child.sl_no.toString()}
                            isDragging={dragState.activeId === child.sl_no.toString()}
                            dropPosition={getDropPosition(dragState.overId || '', dragState.activeId || '')}
                          />
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
              </AnimatePresence>
            </SortableContext>

            <DragOverlay dropAnimation={null}>
              {dragState.activeItem ? (
                <div className="backdrop-blur-xl bg-white/30 border-2 border-blue-400 rounded-lg p-2 shadow-2xl cursor-grabbing">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-white/40 rounded">
                      <GripVertical size={18} className="text-white" />
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <div className="p-1.5 bg-gradient-to-br from-blue-400/50 to-purple-400/50 rounded-lg">{dragState.activeItem.icon}</div>
                      <span className="font-semibold text-sm text-white">{dragState.activeItem.name}</span>
                    </div>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>

        <div className="w-full flex items-center justify-end">
          <Button onClick={handleSubmit} variant="outlineGlassy">
            <Save size={20} className="mr-2" />
            Submit Menu
          </Button>
        </div>
      </motion.div>

      <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
        <DialogContent className="backdrop-blur-xl bg-transparent border border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">View Menu Item</DialogTitle>
          </DialogHeader>
          {viewItem && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg">
                <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">{viewItem.icon}</div>
                <span className="font-semibold text-lg">{viewItem.name}</span>
              </div>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="p-2 bg-white/5 rounded">
                  <span className="text-gray-400">Serial No:</span>
                  <span className="ml-2 font-mono">{viewItem.sl_no}</span>
                </div>
                <div className="p-2 bg-white/5 rounded">
                  <span className="text-gray-400">Path:</span>
                  <span className="ml-2 font-mono">{viewItem.path}</span>
                </div>
                <div className="p-2 bg-white/5 rounded">
                  <span className="text-gray-400">Icon:</span>
                  <span className="ml-2">{viewItem.iconName || 'N/A'}</span>
                </div>
                {viewItem.children && (
                  <div className="p-2 bg-white/5 rounded">
                    <span className="text-gray-400">Submenu Items:</span>
                    <span className="ml-2">{viewItem.children.length}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent className="backdrop-blur-xl bg-transparent border border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Menu Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-white mb-2">Name</Label>
              <Input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            <div>
              <Label className="text-white mb-2">Path</Label>
              <Input
                value={formData.path}
                onChange={e => setFormData({ ...formData, path: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
            {/* <div>
              <Label className="text-white mb-2">Icon</Label>
              <select
                value={formData.iconName}
                onChange={e => setFormData({ ...formData, iconName: e.target.value })}
                className="w-full p-2 bg-white/10 border border-white/20 rounded-md text-white"
              >
                {iconOptions.map(icon => (
                  <option key={icon} value={icon} className="bg-slate-800">
                    {icon}
                  </option>
                ))}
              </select>
            </div> */}
            <div>
              <Label className="text-white mb-2">Icon</Label>
              <ScrollArea className="w-full h-48 pr-1">
                <div className="grid grid-cols-4 gap-2 p-2">
                  {iconOptions.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, iconName: icon })}
                      className={`flex flex-col items-center gap-1 p-2 rounded-md transition-all ${
                        formData.iconName === icon ? 'bg-blue-500/30 border-2 border-blue-400' : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-white">{iconMap[icon]}</div>
                      <span className="text-xs text-gray-300 truncate w-full text-center">{icon}</span>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div className="w-full flex items-center justify-end">
              <Button onClick={handleEditSave} variant="outlineGlassy" size="sm">
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
        <DialogContent className="backdrop-blur-xl bg-transparent border border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Add New Menu</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-white mb-2">Name</Label>
              <Input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Enter menu name"
              />
            </div>
            <div>
              <Label className="text-white mb-2">Path</Label>
              <Input
                value={formData.path}
                onChange={e => setFormData({ ...formData, path: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="/dashboard/..."
              />
            </div>
            <div>
              <Label className="text-white mb-2">Icon</Label>
              <ScrollArea className="w-full h-48 pr-1">
                <div className="grid grid-cols-4 gap-2 p-2">
                  {iconOptions.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, iconName: icon })}
                      className={`flex flex-col items-center gap-1 p-2 rounded-md transition-all ${
                        formData.iconName === icon ? 'bg-blue-500/30 border-2 border-blue-400' : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-white">{iconMap[icon]}</div>
                      <span className="text-xs text-gray-300 truncate w-full text-center">{icon}</span>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div className="w-full flex justify-end">
              <Button onClick={handleAddNew} variant="outlineGlassy">
                Add Menu
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!addParentItem} onOpenChange={() => setAddParentItem(null)}>
        <DialogContent className="backdrop-blur-xl bg-transparent border border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Add Submenu to &quot;{addParentItem?.name}&quot;</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-white mb-2">Name</Label>
              <Input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Enter submenu name"
              />
            </div>
            <div>
              <Label className="text-white mb-2">Path</Label>
              <Input
                value={formData.path}
                onChange={e => setFormData({ ...formData, path: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
                placeholder="/dashboard/..."
              />
            </div>
            {/* <div>
              <Label className="text-white mb-2">Icon</Label>
              <select
                value={formData.iconName}
                onChange={e => setFormData({ ...formData, iconName: e.target.value })}
                className="w-full p-2 bg-white/10 border border-white/20 rounded-md text-white"
              >
                {iconOptions.map(icon => (
                  <option key={icon} value={icon} className="bg-slate-800">
                    {icon}
                  </option>
                ))}
              </select>
            </div> */}
            <div>
              <Label className="text-white mb-2">Icon</Label>
              <ScrollArea className="w-full h-48 pr-1">
                <div className="grid grid-cols-4 gap-2 p-2">
                  {iconOptions.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, iconName: icon })}
                      className={`flex flex-col items-center gap-1 p-2 rounded-md transition-all ${
                        formData.iconName === icon ? 'bg-blue-500/30 border-2 border-blue-400' : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-white">{iconMap[icon]}</div>
                      <span className="text-xs text-gray-300 truncate w-full text-center">{icon}</span>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div className="w-full flex items-center justify-end">
              <Button onClick={handleAddChild} variant="outlineGlassy" size="sm">
                Add Submenu
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <DialogContent className="backdrop-blur-xl bg-transparent border border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Delete Menu Item</DialogTitle>
          </DialogHeader>
          {deleteItem && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="p-2 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-lg">{deleteItem.icon}</div>
                <div className="flex-1">
                  <p className="font-semibold text-lg">{deleteItem.name}</p>
                  <p className="text-sm text-gray-400 font-mono">{deleteItem.path}</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                Are you sure you want to delete <span className="font-semibold text-white">&quot;{deleteItem.name}&quot;</span>? This action cannot be undone.
              </p>
              {deleteItem.children && deleteItem.children.length > 0 && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-yellow-300 text-sm font-medium">
                    ⚠️ Warning: This menu has {deleteItem.children.length} submenu item(s) that will also be deleted.
                  </p>
                </div>
              )}
              <div className="flex items-center gap-3 justify-end pt-2">
                <Button onClick={() => setDeleteItem(null)} variant="outlineGlassy" size="sm">
                  Cancel
                </Button>
                <Button onClick={confirmDelete} variant="outlineFire" size="sm">
                  <Trash2 size={16} className="" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
