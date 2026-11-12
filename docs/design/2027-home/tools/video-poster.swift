// Extract the frame at time t (seconds) of a video as a PNG, at full resolution. Read-only on the source.
import AVFoundation
import AppKit
let a = CommandLine.arguments
let asset = AVURLAsset(url: URL(fileURLWithPath: a[1]))
let gen = AVAssetImageGenerator(asset: asset)
gen.appliesPreferredTrackTransform = true
gen.requestedTimeToleranceBefore = .zero; gen.requestedTimeToleranceAfter = .zero
let t = CMTime(seconds: Double(a[3]) ?? 0, preferredTimescale: 600)
let cg = try! gen.copyCGImage(at: t, actualTime: nil)
let rep = NSBitmapImageRep(cgImage: cg)
try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: a[2]))
print(a[2], cg.width, cg.height)
