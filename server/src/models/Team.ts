import mongoose, { Document, Schema } from 'mongoose';

export interface ITeam extends Document {
  teamName: string;
  teamType: 'Duo' | 'Trio' | 'FNF';
  ownerWalletAddress: string;
  memberWalletAddresses: string[];
  createdAt: Date;
}

const TeamSchema: Schema = new Schema({
  teamName: {
    type: String,
    required: true,
    trim: true
  },
  teamType: {
    type: String,
    enum: ['Duo', 'Trio', 'FNF'],
    required: true
  },
  ownerWalletAddress: {
    type: String,
    required: true,
    trim: true
  },
  memberWalletAddresses: [{
    type: String,
    required: true,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<ITeam>('Team', TeamSchema);
