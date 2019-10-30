import tensorflowjs as tfjs
from keras.models import load_model
model = load_model('Model_with_15_Epochs.h5')
tfjs.converters.save_keras_model(model, "jsmodel/")
