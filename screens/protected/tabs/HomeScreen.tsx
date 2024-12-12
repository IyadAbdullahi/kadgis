import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Switch, Text, View, StatusBar, StyleSheet, FlatList } from "react-native";
import { useAuthStore } from '../../../store/auth';
import { useSQLiteContext } from 'expo-sqlite';
import KadgisController from '../../../store/sqliteDb';
import { Mosque } from '../../../store/form';
import { FontAwesome5 } from '@expo/vector-icons';



const routes = [
    {
        icon: 'home',
        text: 'Residential',
        route: 'Mosque',
        color: '#10b981',
        background: '#a7f3d0',
    },
    {
        icon: 'building',
        text: 'Commercial',
        route: 'School',
        color: '#06b6d4',
        background: '#cffafe',
    },
    {
        icon: 'industry',
        text: 'Industrial',
        route: 'Office',
        color: '#f59e0b',
        background: '#fef3c7',
    },
    {
        icon: 'warehouse',
        text: 'Agricultural',
        route: 'Land',
        color: '#f43f5e',
        background: '#ffe4e6',
    },
    {
        icon: 'users',
        text: 'Public Institution',
        route: 'Others',
        color: '#f59e0b',
        background: '#ffedd5',
    },
    // {
    //     icon: 'box',
    //     text: 'Equipments',
    //     route: 'Personels',
    //     color: '#8b5cf6',
    //     background: '#ede9fe',
    // }
]

interface MosqueProps {
    mosque: Mosque;
}

const MosqueItem: React.FC<MosqueProps> = ({ mosque }) => (
    <View style={styles.mosqueItemContainer}>
        <View style={styles.mosqueItemHeader}>
            <Text style={styles.mosqueName}>{mosque.name}</Text>
            <View style={[styles.statusContainer, mosque.published ? styles.published : styles.unpublished]}>
                <View style={[styles.statusDot, mosque.published ? styles.publishedDot : styles.unpublishedDot]} />
                <Text style={styles.statusText}>{mosque.published ? 'Remote' : 'Local'}</Text>
            </View>
        </View>
        <Text style={styles.dateText}>{new Date().toISOString()}</Text>
    </View>
);

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [mode, setMode] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [recordStats, setRecordStats] = useState(0)
    const [totalTypes, setTotalTypes] = useState<{ type: string; count: number }[]>([])
    const { user } = useAuthStore();
    const db = useSQLiteContext();
    const [mosquesArr, setMosquesArr] = useState<Mosque[]>([]);


    useEffect(() => {
        const fetchData = async () => {
            const types = [
                'Residential',
                'Commercial',
                'Public Institution',
                'Industrial',
                'Agricultural'
            ]
            try {
                const kadgisController = await KadgisController.getInstance(db);
                const total = await kadgisController.countProperty();
                const totalType = await kadgisController.countTypes(types);
                setRecordStats(total);
                setTotalTypes(totalType)

                // const allMosques = await mosqueController.getAllMosques();
                // setMosquesArr(allMosques);
            } catch (error) {
                console.error('Error fetching mosques:', error);
            }
        };

        fetchData();
    }, []);

    const handlePublish = () => {
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handleSwitchChange = (value: boolean) => {
        setMode(value);
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <StatusBar backgroundColor='#fff' barStyle='dark-content' />
                {/* Mode Indicator */}
                <View style={styles.modeIndicator}>
                    {/* <Pressable style={[styles.modeButton, mode ? styles.online : styles.offline]}>
                        <View style={[styles.modeDot, mode ? styles.onlineDot : styles.offlineDot]} />
                        <Text style={styles.modeText}>{mode ? 'Online' : 'Offline'}</Text>
                    </Pressable> */}

                    <View style={{ flexDirection: 'column', gap: 2 }}>
                        <Text style={styles.userName}>{user?.fullName}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                            <FontAwesome5 name={'map-marker-alt'} size={15} color={'#64748b'} />
                            <Text style={styles.userInfoText}>{user?.lga}</Text>
                        </View>
                    </View>

                    {/* <Switch
                        value={mode}
                        onValueChange={handleSwitchChange}
                        thumbColor={mode ? "#4caf50" : "#f44336"}
                        trackColor={{ false: "#f44336", true: "#81c784" }}
                    /> */}
                    <Pressable
                        style={{ padding: 8, elevation: 2, backgroundColor: '#ffffff', borderRadius: 100 }}
                        onPress={() => navigation.navigate('Settings')}>
                        <FontAwesome5 name={'cog'} size={25} color={'#64748b'} />
                    </Pressable>
                </View>

                <View style={styles.userInfoCard}>
                    <View style={styles.userInfoLeft}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={styles.userInfoRow}>
                                <FontAwesome5 name={'file-upload'} size={25} color={'#64748b'} />
                                <View>
                                    <Text style={styles.boldText}>{`${recordStats}`}</Text>
                                    <Text style={styles.userInfoText}>Local</Text>
                                </View>
                            </View>
                            <View style={styles.userInfoRow}>
                                <FontAwesome5 name={'database'} size={25} color={'#64748b'} />
                                <View>
                                    <Text style={styles.boldText}>0</Text>
                                    <Text style={styles.userInfoText}>Total Record</Text>
                                </View>
                            </View>
                            <View style={styles.userInfoRow}>
                                <Pressable style={{ backgroundColor: '#0c4a6e', padding: 10, borderRadius: 50, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                    {/* <Text style={{ color: '#fff' }}>Publish</Text> */}
                                    <FontAwesome5 name={'arrow-alt-circle-up'} size={20} color={'#fff'} />
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Diagnostics Information */}
                {/* <View style={styles.diagnosticsContainer}>
                    <Text style={styles.diagnosticsHeader}>Diagnostics</Text>
                    <View style={styles.diagnosticsContent}>
                        <View style={styles.diagnosticsItem}>
                            <Icon name="server-network" size={30} color="#4caf50" />
                            <Text style={styles.diagnosticsText}>Network</Text>
                            <Text style={styles.diagnosticsSubText}>Good</Text>
                        </View>
                        <View style={styles.diagnosticsItem}>
                            <Icon name="database" size={30} color="#2196f3" />
                            <Text style={styles.diagnosticsText}>Storage</Text>
                            <Text style={styles.diagnosticsSubText}>Available</Text>
                        </View>
                        <View style={styles.diagnosticsItem}>
                            <Icon name="timer-outline" size={30} color="#ff9800" />
                            <Text style={styles.diagnosticsText}>Uptime</Text>
                            <Text style={styles.diagnosticsSubText}>72 hrs</Text>
                        </View>
                    </View>
                </View> */}
                <View style={styles.boxContainer}>
                    {routes.map(item => {
                        // Find the matching type in totalTypes
                        const typeData = totalTypes.find(type => type.type === item.text);
                        // Use the count if found, otherwise fallback to 0
                        const count = typeData ? typeData.count : 0;

                        return (
                            <Pressable key={item.text} style={[styles.box, { backgroundColor: item.background }]}>
                                <FontAwesome5 name={item.icon} size={25} color={item.color} />
                                <Text style={{ fontWeight: '600' }}>{item.text}</Text>
                                <Text style={{ fontWeight: '300' }}>{count}</Text>
                            </Pressable>
                        );
                    })}
                </View>
                <View style={{ height: 20 }} />
                {/* Publish Button */}
                <View>
                    <Text style={[styles.boldText, { marginBottom: 10 }]}>Recents Upload</Text>
                    {mosquesArr.slice(0, 3).map((item, index) => <MosqueItem key={index} mosque={item} />)}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff', // bg-white
        paddingTop: 10, // pt-5
        paddingHorizontal: 20, // px-5
    },
    modeIndicator: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    modeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4, // py-1
        paddingHorizontal: 12, // px-3
        borderRadius: 20, // rounded-full
    },
    online: {
        backgroundColor: '#d1fae5', // bg-green-100
    },
    offline: {
        backgroundColor: '#fee2e2', // bg-red-100
    },
    modeDot: {
        height: 12, // h-3
        width: 12, // w-3
        borderRadius: 50, // rounded-full
        marginRight: 8, // mr-3
    },
    onlineDot: {
        backgroundColor: '#4ade80', // bg-green-400
    },
    offlineDot: {
        backgroundColor: '#f87171', // bg-red-400
    },
    modeText: {
        fontSize: 14, // text-sm
    },
    diagnosticsContainer: {
        marginBottom: 20, // mb-5
        padding: 16, // p-4
        backgroundColor: '#ffffff', // bg-white
        borderRadius: 8, // rounded-lg
        elevation: 2, // shadow-md
    },
    diagnosticsHeader: {
        fontWeight: 'bold',
        fontSize: 18, // text-lg
        marginBottom: 12, // mb-3
    },
    diagnosticsContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    diagnosticsItem: {
        alignItems: 'center',
    },
    diagnosticsText: {
        fontSize: 14, // text-sm
        fontWeight: '600', // font-semibold
        color: '#4b5563', // gray-700
    },
    diagnosticsSubText: {
        fontSize: 12, // text-xs
        color: '#4ade80', // green-500
    },
    userInfoCard: {
        flexDirection: 'row',
        backgroundColor: '#e0f2fe', // bg-blue/50
        marginBottom: 12, // mb-3
        borderRadius: 8, // rounded-lg
        overflow: 'hidden', // overflow-hidden
    },
    userInfoLeft: {
        flex: 3,
        padding: 16, // p-4
        backgroundColor: '#bfdbfe', // bg-blue-100
    },
    userName: {
        fontSize: 15, // text-lg
        fontWeight: 'bold',
    },
    userInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    userInfoText: {
        color: "#64748b",
        fontSize: 12, // text-
    },
    boldText: {
        fontWeight: 'bold',
    },
    userInfoRight: {
        flex: 2,
        flexDirection: 'column',
    },
    recordContainer: {
        flex: 1,
        paddingVertical: 15, // p-2
        alignItems: 'center',
        justifyContent: 'center',
    },
    greenBackground: {
        backgroundColor: '#d1fae5', // bg-green-100
    },
    redBackground: {
        backgroundColor: '#fee2e2', // bg-red-100
    },
    recordCount: {
        fontWeight: '800', // font-extrabold
        fontSize: 24, // text-xl
        color: '#4b5563', // slate-500
    },

    boxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flexWrap: 'wrap',
        marginVertical: 5
    },

    box: {
        width: "30%",  // Adjust size as necessary for your design
        height: 100,
        flexDirection: 'column',
        gap: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: '#ccc'
    },
    mosqueItemContainer: {
        width: '100%',
        padding: 12, // p-3
        borderColor: '#cbd5e1', // border-slate-300
        borderWidth: 1,
        backgroundColor: '#ffffff', // bg-white
        borderRadius: 8, // rounded-lg
        elevation: 2, // shadow-md
        marginBottom: 8, // mb-2
    },
    mosqueItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4, // mb-1
    },
    mosqueName: {
        fontWeight: 'bold',
        fontSize: 16, // text-md
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        borderRadius: 20, // rounded-full
    },
    published: {
        backgroundColor: '#d1fae5', // bg-green-100
    },
    unpublished: {
        backgroundColor: '#fee2e2', // bg-red-100
    },
    statusDot: {
        width: 8, // w-2
        height: 8, // h-2
        borderRadius: 50, // rounded-full
    },
    publishedDot: {
        backgroundColor: '#4ade80', // bg-green-400
    },
    unpublishedDot: {
        backgroundColor: '#f87171', // bg-red-400
    },
    statusText: {
        fontSize: 12, // text-xs
        marginLeft: 4, // ml-1
        color: '#4b5563', // gray-600
    },
    dateText: {
        fontSize: 10, // text-xs
        color: '#6b7280', // gray-500
    },
});

export default HomeScreen;
