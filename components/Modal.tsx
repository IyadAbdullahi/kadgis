import * as React from 'react';
import {
  GestureResponderEvent,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  View
} from 'react-native';
import Button from './Button';

type ModalComponentProps = {
  visible: boolean;
  onClose: (event: GestureResponderEvent) => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  styles?: string;
};

const ModalComponent: React.FC<ModalComponentProps> = ({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
  styles
}) => {
  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      style={{ flex: 1, justifyContent: 'center' }}
    >
      <Modal
        transparent={true}
        visible={visible}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View
          style={[
            { flex: 1, justifyContent: 'flex-end', backgroundColor: '#00000080' }
          ]}
        >
          <View
            style={{
              width: '100%',
              height: '83.33%', // Equivalent to 5/6 of the screen height
              backgroundColor: '#FFFFFF',
              padding: 20,
              borderRadius: 10,
            }}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
            {title && (
              <Text style={{ marginBottom: 20, fontSize: 18, fontWeight: 'bold' }}>
                {title}
              </Text>
            )}
            <View>{children}</View>
            {showCloseButton && (
              <Button
                variant="outline"
                title={'Close'}
                onPress={onClose}
              />
            )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default ModalComponent;