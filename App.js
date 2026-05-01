import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, StyleSheet, SafeAreaView,
  KeyboardAvoidingView, Platform, StatusBar,
  Alert, Modal
} from 'react-native';

export default function App() {
  const [task, setTask] = useState('');
  const [priority, setPriority] = useState('Sedang'); 
  const [taskList, setTaskList] = useState([]);
  const [filter, setFilter] = useState('Semua');
  const [editingId, setEditingId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editValue, setEditValue] = useState('');

  const saveTask = () => {
    if (task.trim().length === 0) {
      Alert.alert('Misi Kosong', 'Tuliskan rencana hebatmu dulu, Viona! ✨');
      return;
    }
    const newTask = { 
      id: Date.now().toString(), 
      text: task, 
      completed: false,
      priority: priority 
    };
    setTaskList([newTask, ...taskList]);
    setTask('');
    setPriority('Sedang'); 
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditValue(item.text);
    setModalVisible(true);
  };

  const saveEdit = () => {
    if (editValue.trim().length === 0) return;
    setTaskList(taskList.map(item => item.id === editingId ? { ...item, text: editValue } : item));
    setModalVisible(false);
    setEditingId(null);
  };

  const toggleComplete = (id) => {
    setTaskList(taskList.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const deleteTask = (id) => {
    setTaskList(taskList.filter(item => item.id !== id));
  };

  const getPriorityColor = (p) => {
    switch(p) {
      case 'Tinggi': return '#FF7675'; 
      case 'Rendah': return '#20BF6B'; 
      default: return '#A29BFE';      
    }
  };

  const filteredTasks = taskList.filter(item => {
    if (filter === 'Belum') return !item.completed;
    if (filter === 'Beres') return item.completed;
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        
        {/* HEADER - Tanggal Dihapus & Padding Ditambah */}
        <View style={styles.header}>
          <Text style={styles.title}>My Daily Quest</Text>
          <Text style={styles.subTitle}>{taskList.filter(t => t.completed).length} dari {taskList.length} tugas beres! ✨</Text>
        </View>

        <View style={styles.filterContainer}>
          {['Semua', 'Belum', 'Beres'].map((type) => (
            <TouchableOpacity 
              key={type} 
              style={[styles.filterTab, filter === type && styles.filterActive]} 
              onPress={() => setFilter(type)}
            >
              <Text style={[styles.filterText, filter === type && styles.filterTextActive]}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputArea}>
          <View style={styles.priorityRow}>
            {['Tinggi', 'Sedang', 'Rendah'].map((p) => (
              <TouchableOpacity 
                key={p} 
                style={[
                  styles.pPill, 
                  priority === p && {backgroundColor: getPriorityColor(p), borderColor: getPriorityColor(p)}
                ]} 
                onPress={() => setPriority(p)}
              >
                <Text style={[styles.pText, priority === p && {color: '#fff'}]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Apa misi selanjutnya?"
              placeholderTextColor="#99a"
              value={task}
              onChangeText={setTask}
            />
            <TouchableOpacity style={styles.addButton} onPress={saveTask}>
              <Text style={styles.addIcon}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.taskCard}>
              <View style={[styles.verticalBar, {backgroundColor: getPriorityColor(item.priority)}]} />
              
              <TouchableOpacity 
                style={[styles.checkSquare, item.completed && styles.checkSquareDone]} 
                onPress={() => toggleComplete(item.id)}
              >
                {item.completed && <Text style={styles.checkMark}>✓</Text>}
              </TouchableOpacity>
              
              <View style={{flex: 1, marginLeft: 15}}>
                <Text style={[styles.taskText, item.completed && styles.textCompleted]}>{item.text}</Text>
                <Text style={[styles.priorityLabel, {color: getPriorityColor(item.priority)}]}>
                  Prioritas {item.priority}
                </Text>
              </View>
              
              <View style={styles.actionButtons}>
                <TouchableOpacity onPress={() => startEdit(item)}>
                  <Text style={styles.actionIcon}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteTask(item.id)}>
                  <Text style={styles.actionIconDelete}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>☁️</Text>
              <Text style={styles.emptyTitle}>Masih kosong nih...</Text>
              <Text style={styles.emptySubtitle}>Yuk, tulis rencana serumu!</Text>
            </View>
          }
        />

        <Modal transparent={true} visible={modalVisible} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Tugas</Text>
              <TextInput
                style={styles.modalInput}
                value={editValue}
                onChangeText={setEditValue}
                autoFocus={true}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.btnBatal}>Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={saveEdit} style={styles.btnSimpan}>
                  <Text style={styles.btnTextSimpan}>Simpan</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1 },
  header: { 
    paddingHorizontal: 25, 
    paddingBottom: 25, 
    paddingTop: Platform.OS === 'android' ? 45 : 20, // Agar tidak mepet notif
    backgroundColor: '#fff', 
    borderBottomLeftRadius: 40, 
    borderBottomRightRadius: 40, 
    elevation: 2 
  },
  title: { color: '#2D3436', fontSize: 28, fontWeight: '900' },
  subTitle: { color: '#A29BFE', fontSize: 15, marginTop: 5 },

  filterContainer: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 15 },
  filterTab: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 15, backgroundColor: '#fff', elevation: 1 },
  filterActive: { backgroundColor: '#2D3436' },
  filterText: { color: '#2D3436', fontWeight: 'bold', fontSize: 12 },
  filterTextActive: { color: '#fff' },

  inputArea: { paddingHorizontal: 20, marginTop: 10 },
  priorityRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 },
  pPill: { paddingVertical: 6, paddingHorizontal: 18, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#EDF2F7' },
  pText: { fontSize: 12, fontWeight: 'bold', color: '#A0A0A0' },

  inputContainer: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#fff', height: 55, borderRadius: 18, paddingHorizontal: 20, fontSize: 15, elevation: 1, borderWidth: 1, borderColor: '#EDF2F7' },
  addButton: { width: 55, height: 55, backgroundColor: '#2D3436', borderRadius: 18, marginLeft: 12, justifyContent: 'center', alignItems: 'center' },
  addIcon: { color: '#fff', fontSize: 24, fontWeight: 'bold' },

  listContent: { padding: 20 },
  taskCard: { backgroundColor: '#fff', borderRadius: 20, padding: 15, marginBottom: 12, flexDirection: 'row', alignItems: 'center', elevation: 2, borderWidth: 1, borderColor: '#EDF2F7' },
  verticalBar: { width: 5, height: 45, borderRadius: 10, marginRight: 15 },
  checkSquare: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#D1D5DB', justifyContent: 'center', alignItems: 'center' },
  checkSquareDone: { backgroundColor: '#2D3436', borderColor: '#2D3436' },
  checkMark: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  
  taskText: { fontSize: 16, color: '#2D3436', fontWeight: '600' },
  textCompleted: { textDecorationLine: 'line-through', color: '#94A3B8' },
  priorityLabel: { fontSize: 11, fontWeight: '700', marginTop: 3 },
  
  actionButtons: { flexDirection: 'row', gap: 12 },
  actionIcon: { fontSize: 16 },
  actionIconDelete: { fontSize: 16, color: '#2D3436', opacity: 0.4 },

  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyIcon: { fontSize: 50, marginBottom: 10 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#475569' },
  emptySubtitle: { fontSize: 13, color: '#94A3B8', marginTop: 5 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#fff', borderRadius: 25, padding: 25 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  modalInput: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 15, fontSize: 16, marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 20, alignItems: 'center' },
  btnBatal: { color: '#94A3B8', fontWeight: 'bold' },
  btnSimpan: { backgroundColor: '#2D3436', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12 },
  btnTextSimpan: { color: '#fff', fontWeight: 'bold' }
});